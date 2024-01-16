import connectMongoDB from "@/lib/database/client";
import analyticsService from "@/lib/service/AnalyticsService/AnalyticsService";
import sessionService from "@/lib/service/SessionService/SessionService";
import { nextReturn } from "@/lib/utils/api";
import { NextRequest } from "next/server";

/**
 * Remove old results from database after 1 day
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    // const payload = await request.json();
    const totalRemoved = await sessionService.cleanUp();
    return nextReturn(`Remove ${totalRemoved} records`, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
