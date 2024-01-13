import { DATA_SOURCES } from "@/constants/datasources";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import { CrawlerCommandZSchema } from "@/lib/dto/CrawlerCommand.dto";
import { SessionInputDto } from "@/lib/dto/SessionInput.dto";
import { cloneDeep } from "lodash";
import { ClientSession } from "mongoose";

class TravelorCrawlerService {
  /**
   *
   * @param sessionInput
   * @returns travelorJobId
   */
  async createCommand(
    input: SessionInputDto,
    session?: ClientSession
  ): Promise<string> {
    const sessionInput = cloneDeep(input);
    const command = CrawlerCommandZSchema.parse(sessionInput);
    command.dataSource = DATA_SOURCES.TRAVELOR;
    const crawlerJob = new CrawlerJob(command);
    const result = await crawlerJob.save({ session });
    return result._id;
  }
}

const travelorCrawlerService = new TravelorCrawlerService();
export default travelorCrawlerService;
