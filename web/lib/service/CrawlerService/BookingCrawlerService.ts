import { DATA_SOURCES } from "@/constants/datasources";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import { CrawlerCommandZSchema } from "@/lib/dto/CrawlerCommand.dto";
import { SessionInputDto } from "@/lib/dto/SessionInput.dto";
import { autoSelectPlace } from "@/lib/utils/bookingAutoComplete";
import { cloneDeep } from "lodash";
import { ClientSession } from "mongoose";

class BookingCrawlerService {
  /**
   *
   * @param sessionInput
   * @returns bookingJobId
   */
  async createCommand(
    input: SessionInputDto,
    session?: ClientSession
  ): Promise<string> {
    const sessionInput = cloneDeep(input);
    if (!sessionInput?.destination?.dest_type) {
      sessionInput.destination = await autoSelectPlace(
        sessionInput?.destination?.destination
      );
    }
    const command = CrawlerCommandZSchema.parse(sessionInput);
    command.dataSource = DATA_SOURCES.BOOKING;
    const crawlerJob = new CrawlerJob(command);
    const result = await crawlerJob.save({ session });
    return result._id;
  }
}
const bookingCrawlerService = new BookingCrawlerService();
export default bookingCrawlerService;
