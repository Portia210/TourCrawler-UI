import connectMongoDB from "@/lib/database/client";
import Currencies from "@/lib/database/model/CurrencyModel";
import { nextReturn } from "@/lib/utils/api";
import axios from "axios";
import { NextRequest } from "next/server";

/**
 * Get currency exchange rates
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const data = await getCurrencies();
    Currencies.findOneAndUpdate({ base: data.base }, data);
    return nextReturn(data, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

const getCurrencies = async () => {
  const currencies = await axios
    .get(`https://api.frankfurter.app/currencies`)
    .then((res) => res.data);
  const exchageRates = await axios
    .get(`https://api.frankfurter.app/latest?from=USD`)
    .then((res) => res.data);
  const rates = Object.keys(exchageRates.rates).map((key) => ({
    currency: key,
    name: currencies[key],
    rate: exchageRates.rates[key],
  }));
  delete exchageRates.rates;
  return {
    ...exchageRates,
    rates,
  };
};
