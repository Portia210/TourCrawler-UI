import Currencies from "@/lib/database/model/CurrencyModel";
import axios from "axios";
import dayjs from "dayjs";

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
    if (dayjs().diff(currencies?.createdAt, "hour") < 4) {
      console.log("Get currencies from cache");
      return currencies;
    }
    const currenciesData = await axios
      .get(`https://api.frankfurter.app/currencies`)
      .then((res) => res.data);
    const exchageRates = await axios
      .get(`https://api.frankfurter.app/latest?from=USD`)
      .then((res) => res.data);
    const rates = Object.keys(exchageRates.rates).map((key) => ({
      currency: key,
      name: currenciesData[key],
      rate: exchageRates.rates[key],
    }));
    delete exchageRates.rates;
    const results = {
      ...exchageRates,
      rates,
    };
    currencies = Currencies.findOneAndUpdate({ base: results.base }, results);
    return currencies;
  }
}

const currencyService = new CurrencyService();
export default currencyService;
