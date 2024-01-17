import connectMongoDB from "@/lib/database/client";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import SessionInput from "@/lib/database/model/SessionInputModel";
import analyticsService from "@/lib/service/AnalyticsService/AnalyticsService";
import sessionService from "@/lib/service/SessionService/SessionService";
import { nextReturn } from "@/lib/utils/api";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest } from "next/server";

/**
 * Perform analytics for Travelor and Booking Hotels base on sessionId
 */
export async function GET(request: NextRequest, context: any) {
  noStore();
  try {
    const { id } = context.params;
    await connectMongoDB();
    const params = request.nextUrl.searchParams;
    const result = await sessionService.getSessionResult(id);
    return nextReturn(result, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
