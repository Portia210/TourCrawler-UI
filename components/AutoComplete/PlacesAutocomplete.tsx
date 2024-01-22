"use client";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { ITourCompareDestination } from "../types";

interface PlacesAutocompleteProps {
  value?: any;
  onChange?: (val: ITourCompareDestination) => void;
}
const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleGooglePlaceClick = async (placeId: string, address: string) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    if (props?.onChange) {
      props.onChange({ placeId, destination: address, lat, lng });
    }
  };

  const onInputChange = async (input: string) => {
    setValue(input);
  };

  const travelorComboList = () => {
    return (
      <ComboboxList>
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <ComboboxOption
              key={place_id}
              value={description}
              onClick={() => handleGooglePlaceClick(place_id, description)}
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
        disabled={!ready}
        className="w-1/2 p-2 rounded-md"
        placeholder="Search an address"
      />
      <ComboboxPopover>{travelorComboList()}</ComboboxPopover>
    </Combobox>
  );
};

export default PlacesAutocomplete;
