import Currencies from "@/lib/database/model/CurrencyModel";
import axios from "axios";

/**
 * All currencies are base on USD
 * @class CurrencyService
 */
class CurrencyService {
  /**
   * Get all currencies
   */

  async getCurrencies() {
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
    const results = {
      ...exchageRates,
      rates,
    };
    Currencies.findOneAndUpdate({ base: results.base }, results);
    return results;
  }
}

const currencyService = new CurrencyService();
export default currencyService;
