import SessionInput from "@/lib/database/model/SessionInputModel";
import { SessionInputDto } from "@/lib/dto/SessionInput.dto";
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
      throw err;
    } finally {
      await mongooseSession.commitTransaction();
    }
  }
}

const sessionService = new SessionService();
export default sessionService;
