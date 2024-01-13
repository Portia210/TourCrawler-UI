import axios from "axios";
import { BookingAutoCompleteResult } from "../types/bookingAutoComplete/bookingAutocomplete";

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
    address: result?.label,
    dest_type: result?.dest_type,
    lat: result?.latitude,
    lng: result?.longitude,
  };
};

const autoSelectPlace = async (destination: string | undefined) => {
  if (!destination) throw new Error("Destination is required");
  const results = await bookingAutoComplete(destination);
  const places = results?.map((item) => filterBookingResult(item)) || [];
  if (!places.length) throw new Error("No places found");
  const place = places.shift();
  return {
    placeId: place?.placeId,
    destination: place?.address,
    dest_type: place?.dest_type,
    lat: place?.lat,
    lng: place?.lng,
  };
};

export { autoSelectPlace, filterBookingResult, bookingAutoComplete };
