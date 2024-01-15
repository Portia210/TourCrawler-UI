import BookingHotel from "../../database/model/BookingHotelModel";
import currencyService from "../CurrecyService/CurrencyService";
import { DEFAULT_CURRENCY } from "../CurrecyService/config";
import { filters } from "./config";
import { HotelAggregateResult } from "./types";

class AnalyticsService {
  async analytics(
    bookingJobId: string,
    travelorJobId: string,
    simpleReport = true
  ) {
    const results = await this.compare(bookingJobId, travelorJobId);
    const totalResults = results.length;
    if (simpleReport) {
      return {
        totalResults,
        results,
      };
    }
    const totalBookingCheaperHotels = results.filter(
      (hotel) => Number(hotel.price_difference) > 0
    ).length;
    const totalTravelorCheaperHotels = results.filter(
      (hotel) => Number(hotel.price_difference) < 0
    ).length;
    const bookingCheaperHotelsInPercentage =
      (totalBookingCheaperHotels / totalResults) * 100;
    const travelorCheaperHotelsInPercentage =
      100 - bookingCheaperHotelsInPercentage;
    const avgPriceDifference =
      results.reduce((acc, hotel) => acc + Number(hotel.price_difference), 0) /
      totalResults;
    const minPriceDifference = Math.min(
      ...results.map((hotel) => Number(hotel.price_difference))
    );
    const maxPriceDifference = Math.max(
      ...results.map((hotel) => Number(hotel.price_difference))
    );
    const currency = DEFAULT_CURRENCY;
    return {
      currency,
      avgPriceDifference,
      minPriceDifference,
      maxPriceDifference,
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
