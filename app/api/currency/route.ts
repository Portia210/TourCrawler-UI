import connectMongoDB from "@/lib/database/client";
import currencyService from "@/lib/service/CurrecyService/CurrencyService";
import { CURRENCIES } from "@/lib/service/CurrecyService/config";
import { nextReturn } from "@/lib/utils/api";
import { NextRequest } from "next/server";

/**
 * Get currency exchange rates
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    let currencies = await currencyService.getCurrencies();
    const baseCurrency = {
      currency: currencies.base,
      name: "United States Dollar",
      rate: 1,
      symbol: CURRENCIES[currencies.base],
    };
    currencies.rates.unshift(baseCurrency);
    return nextReturn(currencies, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
