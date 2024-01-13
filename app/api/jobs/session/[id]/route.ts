import connectMongoDB from "@/lib/database/client";
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
    const { id } = context.params;
    await connectMongoDB();
    const sessionInput = await SessionInput.findById(id).exec();
    if (!sessionInput) return nextReturn("Session not found", 404, "NOT_FOUND");
    const { bookingJobId, travelorJobId } = sessionInput;
    const analytics = await analyticsService.analytics(
      bookingJobId,
      travelorJobId
    );
    return nextReturn(analytics, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
