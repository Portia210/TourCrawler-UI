import { filterCompareResults } from "@/lib/utils/filterCompareResults";
import BookingHotel from "../../database/model/BookingHotelModel";
import currencyService from "../CurrecyService/CurrencyService";
import { DEFAULT_CURRENCY } from "../CurrecyService/config";
import { filters } from "./config";
import { HotelAggregateResult } from "./types";

class AnalyticsService {
  async analytics(
    bookingJobId: string,
    travelorJobId: string,
    currency: string
  ) {
    const { results } = await this.compare(
      bookingJobId,
      travelorJobId,
      currency
    );
    const filterResults = filterCompareResults(results);
    return {
      currency,
      ...filterResults,
      results,
    };
  }

  async compare(bookingJobId: string, travelorJobId: string, currency: string) {
    const hotels: HotelAggregateResult[] = await BookingHotel.aggregate(
      filters(bookingJobId, travelorJobId)
    ).sort({
      travelorPrice: -1,
    });
    const results = await this.filterResults(hotels);
    return {
      results,
      totalResults: results.length,
    };
  }

  private async filterResults(
    hotelResults: HotelAggregateResult[]
  ): Promise<any[]> {
    const results = await Promise.all(
      hotelResults.map(async (result) => {
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
        const price_difference = (
          Number(bookingPrice) - Number(travelorPrice)
        ).toFixed(2);
        // Todo: remove this in the future
        if (Number(bookingPrice) - Number(travelorPrice) < 0) {
          return;
        }
        return {
          ...result,
          bookingCurrency,
          travelorCurrency,
          bookingPrice: Math.round(Number(bookingPrice)),
          travelorPrice: Math.round(Number(travelorPrice)),
          price_difference,
        };
      })
    );
    return results.filter(Boolean);
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
