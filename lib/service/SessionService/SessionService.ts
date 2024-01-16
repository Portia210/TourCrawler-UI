import BookingHotel from "@/lib/database/model/BookingHotelModel";
import SessionInput from "@/lib/database/model/SessionInputModel";
import TravelorHotel from "@/lib/database/model/TravelorHotelModel";
import { SessionInputDto } from "@/lib/dto/SessionInput.dto";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import mongoose from "mongoose";
import bookingCrawlerService from "../CrawlerService/BookingCrawlerService";
import travelorCrawlerService from "../CrawlerService/TravelorCrawlerService";

class SessionService {
  async createSession(sessionInput: SessionInputDto): Promise<string> {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    try {
      const jobIds = await Promise.all([
        bookingCrawlerService.createCommand(sessionInput, mongooseSession),
        travelorCrawlerService.createCommand(sessionInput, mongooseSession),
      ]);
      let data: any = cloneDeep(sessionInput);
      data.bookingJobId = jobIds[0];
      data.travelorJobId = jobIds[1];
      const sessionInputSearch = new SessionInput(data);
      const result = await sessionInputSearch.save({
        session: mongooseSession,
      });
      return result._id;
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
    return session?._id;
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
