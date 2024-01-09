import BookingHotel from "../../database/model/BookingHotelModel";
import currencyService from "../CurrecyService/CurrencyService";
import { DEFAULT_CURRENCY } from "../CurrecyService/config";
import { filters } from "./config";
import { HotelAggregateResult } from "./types";

class AnalyticsService {
  async compare() {
    const results: HotelAggregateResult[] = await BookingHotel.aggregate(
      filters
    );
    return await this.filterResults(results);
  }

  private async filterResults(results: HotelAggregateResult[]): Promise<any[]> {
    return await Promise.all(
      results.map(async (result) => {
        let { bookingCurrency, bookingPrice, travelorCurrency, travelorPrice } =
          result;
        bookingPrice = await currencyService.convertCurrency(
          bookingCurrency,
          DEFAULT_CURRENCY,
          bookingPrice
        );
        bookingCurrency = DEFAULT_CURRENCY;

        travelorPrice = await currencyService.convertCurrency(
          travelorCurrency,
          DEFAULT_CURRENCY,
          travelorPrice
        );
        travelorCurrency = DEFAULT_CURRENCY;
        const price_difference = Number(bookingPrice) - Number(travelorPrice);
        return {
          ...result,
          bookingCurrency,
          travelorCurrency,
          bookingPrice,
          travelorPrice,
          price_difference,
        };
      })
    );
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
