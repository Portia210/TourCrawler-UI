import connectMongoDB from "@/lib/database/client";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import SessionInput from "@/lib/database/model/SessionInputModel";
import analyticsService from "@/lib/service/AnalyticsService/AnalyticsService";
import { nextReturn } from "@/lib/utils/api";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";

/**
 * Perform analytics for Travelor and Booking Hotels base on sessionId
 */
export async function GET(request: NextRequest, context: any) {
  noStore();
  try {
    let status = "RUNNING";
    const { id } = context.params;
    await connectMongoDB();
    const sessionInput = await SessionInput.findById(id).exec();
    if (!sessionInput) return nextReturn("Session not found", 404, "NOT_FOUND");
    const { bookingJobId, travelorJobId } = sessionInput;
    const bookingJob = await CrawlerJob.findById(bookingJobId).exec();
    const travelorJob = await CrawlerJob.findById(travelorJobId).exec();
    if (!bookingJob || !travelorJob)
      return nextReturn("Job not found", 404, "NOT_FOUND");
    if (bookingJob.status === "FINISHED" && travelorJob.status === "FINISHED") {
      status = bookingJob.status;
    } else if (
      bookingJob.status === "FAILED" ||
      travelorJob.status === "FAILED"
    ) {
      status = "FAILED";
    }
    let analytics = await analyticsService.analytics(
      bookingJobId,
      travelorJobId
    );
    return nextReturn(
      {
        ...analytics,
        status,
      },
      200,
      "OK"
    );
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
