"use client";
import useBookingAutocomplete from "@/hooks/useBookingAutocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { ITourCompareDestination } from "../types";

interface PlacesBookingAutocompleteProps {
  value?: any;
  onChange?: (val: ITourCompareDestination) => void;
}
const PlacesBookingAutocomplete = (props: PlacesBookingAutocompleteProps) => {
  const [value, setValue] = useState("");
  const { places, autoComplete } = useBookingAutocomplete();

  const handleBookingPlaceClick = async (
    placeId: string,
    address: string,
    lat = 0,
    lng = 0
  ) => {
    if (props?.onChange) {
      props.onChange({ placeId, destination: address, lat, lng });
    }
  };

  const onInputChange = async (input: string) => {
    setValue(input);
    debouncedSearch(input);
  };

  const debouncedSearch = useCallback(
    debounce(async (nextValue) => await autoComplete(nextValue), 500),
    []
  );

  const bookingComboList = () => {
    return (
      <ComboboxList>
        {places?.map(({ placeId, address, lat, lng }) => (
          <ComboboxOption
            key={placeId}
            value={address}
            onClick={() => handleBookingPlaceClick(placeId, address, lat, lng)}
          />
        ))}
      </ComboboxList>
    );
  };

  return (
    <Combobox>
      <ComboboxInput
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        className="w-1/2 p-2 rounded-md"
        placeholder="Search an address"
      />
      <ComboboxPopover>{bookingComboList()}</ComboboxPopover>
    </Combobox>
  );
};

export default PlacesBookingAutocomplete;
