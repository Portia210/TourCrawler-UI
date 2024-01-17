import connectMongoDB from "@/lib/database/client";
import currencyService from "@/lib/service/CurrecyService/CurrencyService";
import { nextReturn } from "@/lib/utils/api";
import { NextRequest } from "next/server";

/**
 * Get currency exchange rates
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const currencies = await currencyService.getCurrencies();
    return nextReturn(currencies, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
