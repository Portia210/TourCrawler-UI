import BookingHotel from "../../database/model/BookingHotelModel";
import currencyService from "../CurrecyService/CurrencyService";
import { DEFAULT_CURRENCY } from "../CurrecyService/config";
import { filters } from "./config";
import { HotelAggregateResult } from "./types";

class AnalyticsService {
  async analytics(bookingJobId: string, travelorJobId: string) {
    const results = await this.compare(bookingJobId, travelorJobId);
    const totalResults = results.length;
    const totalBookingCheaperHotels = results.filter(
      (hotel) => Number(hotel.price_difference) < 0
    ).length;
    const totalTravelorCheaperHotels = results.filter(
      (hotel) => Number(hotel.price_difference) > 0
    ).length;
    const bookingCheaperHotelsInPercentage =
      (totalBookingCheaperHotels / totalResults) * 100;
    const travelorCheaperHotelsInPercentage =
      100 - bookingCheaperHotelsInPercentage;

    return {
      totalBookingCheaperHotels,
      bookingCheaperHotelsInPercentage,
      travelorCheaperHotelsInPercentage,
      totalTravelorCheaperHotels,
      totalResults,
      results,
    };
  }

  private async compare(bookingJobId: string, travelorJobId: string) {
    const results: HotelAggregateResult[] = await BookingHotel.aggregate(
      filters(bookingJobId, travelorJobId)
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
        const price_difference = (
          Number(bookingPrice) - Number(travelorPrice)
        ).toFixed(2);
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
