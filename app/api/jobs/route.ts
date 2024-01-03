import connectMongoDB from "@/lib/database/client";
import CrawlerJob from "@/lib/database/model/CrawlerJob";
import { CrawlerCommandZSchema } from "@/lib/dto/CrawlerCommand.dto";
import { nextReturn } from "@/utils/api";
import { NextRequest } from "next/server";

/**
 * Get jobs
 */
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const jobs = await CrawlerJob.find();
    return nextReturn(jobs, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Create job
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const command = (await request.json()) as CrawlerCommandDto;
    const crawlerJob = new CrawlerJob(command);
    await crawlerJob.save();
    return nextReturn("Command send successfully", 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
