import connectMongoDB from "@/lib/database/client";
import Currencies from "@/lib/database/model/CurrencyModel";
import { nextReturn } from "@/lib/utils/api";
import { NextRequest } from "next/server";
import currencyService from "../../../lib/service/CurrecyService/CurrencyService";

/**
 * Get currency exchange rates
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const data = await currencyService.getCurrencies();
    return nextReturn(data, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
