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
      await mongooseSession.commitTransaction();
      return result._id;
    } catch (err) {
      console.error("createSession", err);
      await mongooseSession.abortTransaction();
      throw err;
    }
  }

  async cleanUp(): Promise<number> {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    try {
      let totalRemoved = 0;
      const oldSessions = await SessionInput.find(
        {
          createdAt: { $lt: dayjs().subtract(1, "day").toDate() },
        },
        null,
        { session: mongooseSession }
      );
      const oldSession = oldSessions[0];
      const results = await Promise.all([
        BookingHotel.deleteMany(
          { jobId: oldSession.bookingJobId },
          { session: mongooseSession }
        ),
        TravelorHotel.deleteMany(
          { jobId: oldSession.travelorJobId },
          { session: mongooseSession }
        ),
      ]);
      totalRemoved = results[0].deletedCount + results[1].deletedCount;
      await mongooseSession.commitTransaction();
      return totalRemoved;
    } catch (err) {
      console.error("cleanUp error -->", err);
      await mongooseSession.abortTransaction();
      throw err;
    }
  }
}

const sessionService = new SessionService();
export default sessionService;
