import connectMongoDB from "@/lib/database/client";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import { nextReturn } from "@/lib/utils/api";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";

/**
 * Get jobs
 */
export async function GET(request: NextRequest, context: any) {
  noStore();
  try {
    const { id } = context.params;
    await connectMongoDB();

    const jobs = await CrawlerJob.find({
      sessionId: {
        $eq: id,
      },
    }).exec();
    return nextReturn(jobs.filter(Boolean), 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
