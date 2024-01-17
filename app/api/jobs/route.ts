import connectMongoDB from "@/lib/database/client";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import { CrawlerCommandZSchema } from "@/lib/dto/CrawlerCommand.dto";
import { nextReturn } from "@/lib/utils/api";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";

/**
 * Get jobs
 */
export async function GET(request: NextRequest) {
  noStore();
  try {
    await connectMongoDB();
    const jobs = await CrawlerJob.find({
      status: {
        $eq: "PENDING",
      },
    })
      .sort({ created_at: -1 })
      .exec();
    return nextReturn(jobs.filter(Boolean), 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Create job
 * @deprecated use POST /api/jobs/session
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const payload = await request.json();
    const command = CrawlerCommandZSchema.parse(payload);
    const crawlerJob = new CrawlerJob(command);
    const result = await crawlerJob.save();
    return nextReturn(result.sessionId, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
