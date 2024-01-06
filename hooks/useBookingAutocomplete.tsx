import { BookingAutoComplete } from "@/types/bookingAutocomplete";
import axios, { isAxiosError } from "axios";
import { useState } from "react";

const useBookingAutocomplete = () => {
  const [places, setPlaces] = useState<BookingAutoComplete[]>([]);
  const [loading, setLoading] = useState(false);

  const autoComplete = async (destination: string) => {
    if (!destination) return [];
    try {
      const places = await axios
        .post(`/api/booking/autocomplete`, {
          destination,
        })
        .then((res) => res?.data);
      setPlaces(places || []);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("autoComplete error --->", error.message);
      } else {
        console.error("error --->", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    autoComplete,
    places,
    loading,
  };
};

export default useBookingAutocomplete;
