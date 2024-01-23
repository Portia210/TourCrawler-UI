import BookingHotel from "@/lib/database/model/BookingHotelModel";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import SessionInput from "@/lib/database/model/SessionInputModel";
import TravelorHotel from "@/lib/database/model/TravelorHotelModel";
import { SessionInputDto } from "@/lib/dto/SessionInput.dto";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import mongoose from "mongoose";
import analyticsService from "../AnalyticsService/AnalyticsService";
import bookingCrawlerService from "../CrawlerService/BookingCrawlerService";
import travelorCrawlerService from "../CrawlerService/TravelorCrawlerService";

class SessionService {
  async createSession(sessionInput: SessionInputDto) {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    try {
      const jobIds = await Promise.all([
        bookingCrawlerService.createCommand(sessionInput, mongooseSession),
        travelorCrawlerService.createCommand(sessionInput, mongooseSession),
      ]);
      let data: any = cloneDeep(sessionInput);
      data.bookingJobId = jobIds[0]._id;
      data.travelorJobId = jobIds[1]._id;
      const sessionInputSearch = new SessionInput(data);
      const result = await sessionInputSearch.save({
        session: mongooseSession,
      });
      return {
        _id: result._id,
        bookingCommand: jobIds[0],
        travelorCommand: jobIds[1],
      };
    } catch (err) {
      console.error("createSession", err);
      await mongooseSession.abortTransaction();
      await mongooseSession.endSession(); // Close the session in case of an error
      throw err;
    } finally {
      await mongooseSession.commitTransaction();
      await mongooseSession.endSession(); // Close the session in any case
    }
  }

  async checkIfSessionExist(sessionInput: SessionInputDto): Promise<string> {
    const session = await SessionInput.findOne({
      ...sessionInput,
      createdAt: { $gt: dayjs().subtract(1, "day").toDate() },
    }).exec();
    return session?._id || null;
  }
  async getSessionResult(id: string) {
    const sessionInput = await SessionInput.findById(id).exec();
    if (!sessionInput) throw new Error("Session not found");

    const { bookingJobId, travelorJobId } = sessionInput;
    const [bookingJob, travelorJob] = await Promise.all([
      CrawlerJob.findById(bookingJobId).exec(),
      CrawlerJob.findById(travelorJobId).exec(),
    ]);

    if (!bookingJob || !travelorJob) throw new Error("Job not found");

    let status = "RUNNING";
    if (bookingJob.status === "FINISHED" && travelorJob.status === "FINISHED") {
      status = bookingJob.status;
    } else if (
      bookingJob.status === "FAILED" ||
      travelorJob.status === "FAILED"
    ) {
      status = "FAILED";
    }

    const analytics = await analyticsService.compare(
      bookingJobId,
      travelorJobId
    );

    return {
      ...analytics,
      status,
    };
  }

  async cleanUp(): Promise<number> {
    return (await mongoose.startSession()).withTransaction(async (session) => {
      let totalRemoved = 0;
      const oldSessions = await SessionInput.find({
        createdAt: { $lt: dayjs().subtract(1, "day").toDate() },
      }).session(session);

      if (!oldSessions.length) return totalRemoved;

      await Promise.all(
        oldSessions.map(async (oldSession) => {
          const bookingDeleteResult = await BookingHotel.deleteMany(
            { jobId: oldSession.bookingJobId },
            { session }
          );
          const travelorDeleteResult = await TravelorHotel.deleteMany(
            { jobId: oldSession.travelorJobId },
            { session }
          );
          totalRemoved +=
            travelorDeleteResult.deletedCount +
            bookingDeleteResult.deletedCount;
        })
      );

      return totalRemoved;
    });
  }
}

const sessionService = new SessionService();
export default sessionService;
