"use client";
import { GOOGLE_MAP_API_KEY } from "@/constants/config";
import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import PlacesAutocomplete from "./PlacesAutocomplete";

export default function TourCompareMap() {
  const [selected, setSelected] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    console.log("selected", selected);
  }, [selected]);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="places-container">
      <PlacesAutocomplete setSelected={setSelected} />
    </div>
  );
}
