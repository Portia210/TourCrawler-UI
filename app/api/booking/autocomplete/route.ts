import { BookingAutoCompleteResult } from "@/lib/responseMapper/bookingAutocomplete";
import { nextReturn } from "@/utils/api";
import axios from "axios";
import { NextRequest } from "next/server";

/**
 * Get booking autocomplete data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.destination)
      return nextReturn("Destimation is required", 400, "BAD_REQUEST");
    // await connectMongoDB();
    const result = await bookingAutoComplete(
      body.destination,
      body?.language,
      body?.size
    );

    return nextReturn(
      result.map((item) => filterBookingResult(item)),
      200,
      "OK"
    );
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

const bookingAutoComplete = async (
  query: string,
  language = "en",
  size: number = 5
): Promise<BookingAutoCompleteResult[]> => {
  const url = `https://accommodations.booking.com/autocomplete.json`;
  const response = await axios
    .post(url, {
      query,
      language,
      size,
    })
    .then((res) => res?.data);
  return response?.results || [];
};

const filterBookingResult = (result: BookingAutoCompleteResult) => {
  return {
    placeId: result?.dest_id,
    label: result?.label,
    dest_type: result?.dest_type,
    lat: result?.latitude,
    lng: result?.longitude,
  };
};
