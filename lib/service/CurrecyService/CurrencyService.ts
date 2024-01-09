import { DEFAULT_CURRENCY } from "./config";

/**
 * All currencies are base on USD
 * @class CurrencyService
 */
class CurrencyService {
  /**
   * Get all currencies
   */
  async getCurrencies() {}

  /**
   * Get currency by code
   * @param code Currency code
   */
  async getCurrency(code: string) {}

  /**
   *
   * @param code Currency code need to convert
   * @param targetCode Target currency code
   * @param amount Amount of currency need to convert
   * @returns Converted amount
   */
  async convertCurrency(
    code: string,
    targetCode: string = DEFAULT_CURRENCY,
    amount: string | number,
    fixed: number = 2
  ) {
    let result = Number(amount); // Convert amount to a number
    if (code === DEFAULT_CURRENCY) {
      return result.toFixed(fixed);
    } else if (code === "VND") {
      result = result / 23933; // Perform division operation todo: get rate from database/api
    } else {
      result = result;
    }
    return result.toFixed(fixed);
  }

  /**
   *
   * @param code Currency code need to update
   * @param rate New rate
   * @returns Updated currency
   */
  async updateCurrency(code: string, rate: Number) {}

  /**
   * @param code Currency code need to delete
   * @returns Deleted currency
   */
  async deleteCurrency(code: string) {}
}

const currencyService = new CurrencyService();
export default currencyService;
