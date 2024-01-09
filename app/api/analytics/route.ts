import connectMongoDB from "@/lib/database/client";
import analyticsService from "@/lib/service/AnalyticsService/AnalyticsService";
import { nextReturn } from "@/utils/api";
import { NextRequest } from "next/server";

/**
 * Perform analytics for Travelor and Booking Hotels
 * @param request - JobIds from both Travelor and Booking
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const payload = await request.json();
    const result = await analyticsService.compare();
    return nextReturn(result, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
