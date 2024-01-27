import Currencies from "@/lib/database/model/CurrencyModel";
import axios from "axios";
import dayjs from "dayjs";
import { CURRENCIES } from "./config";

/**
 * All currencies are base on USD
 * @class CurrencyService
 */
class CurrencyService {
  /**
   * Get all currencies
   */

  async getCurrencies() {
    let currencies = await Currencies.findOne({
      base: "USD",
    }).exec();
    if (currencies && dayjs().diff(currencies?.createdAt, "hour") < 4) {
      console.log("Get Currency from cache");
      return currencies;
    }
    const currenciesData = await axios
      .get(`https://api.frankfurter.app/currencies`)
      .then((res) => res.data);
    const exchageRates = await axios
      .get(`https://api.frankfurter.app/latest?from=USD`)
      .then((res) => res.data);
    const rates = Object.keys(CURRENCIES).map((key: string) => {
      if (!exchageRates.rates[key]) return;
      return {
        currency: key,
        name: currenciesData[key],
        rate: exchageRates.rates[key],
        symbol: CURRENCIES[key],
      };
    }).filter(Boolean);
    delete exchageRates.rates;
    const results = {
      ...exchageRates,
      rates,
    };
    await Currencies.findOneAndUpdate({ base: results.base }, results, {
      upsert: true,
    });
    return results;
  }
}

const currencyService = new CurrencyService();
export default currencyService;
