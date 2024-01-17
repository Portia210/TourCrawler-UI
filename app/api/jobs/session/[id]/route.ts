import connectMongoDB from "@/lib/database/client";
import { DEFAULT_CURRENCY } from "@/lib/service/CurrecyService/config";
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
    const params = new URL(request.url).searchParams;
    const currency = params.get("currency") || DEFAULT_CURRENCY;
    const result = await sessionService.getSessionResult(id, currency);
    return nextReturn(result, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
