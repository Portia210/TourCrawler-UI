import axios from "axios";
import {
  bookingQuery,
  bookingVariables,
} from "../constants/bookingAutoCompleteConfig";
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

const bookingAutoCompleteV2 = async (
  query: string
): Promise<BookingAutoCompleteResult[]> => {
  const url = `https://www.booking.com/dml/graphql`;
  let variables = bookingVariables;
  variables.input.searchString = query;
  const data = {
    operationName: "SearchPlaces",
    variables,
    ...bookingQuery,
  };
  const response = await axios
    .post(`${url}?lang="en-gb"`, data)
    .then((res) => res?.data);
  return response?.data?.searchPlaces?.results || [];
};

const filterBookingResult = (result: BookingAutoCompleteResult) => {
  return {
    placeId: result?.dest_id || result?.placeId,
    address: result?.label,
    dest_type: result?.dest_type || result?.destType,
    lat: result?.latitude || result?.place?.location.latitude,
    lng: result?.longitude || result?.place?.location.longitude,
  };
};

const autoSelectPlace = async (destination: string | undefined) => {
  if (!destination) throw new Error("Destination is required");
  const results = await bookingAutoCompleteV2(destination);
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

export {
  autoSelectPlace,
  bookingAutoComplete,
  bookingAutoCompleteV2,
  filterBookingResult,
};
