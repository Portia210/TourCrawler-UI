import axios from "axios";

/**
 * Select the first place from places array
 */
export const autoSelectPlace = async (destination: string) => {
  if (!destination) throw new Error("Destination is required");
  const places = await axios
    .post(`/api/booking/autocomplete`, {
      destination,
    })
    .then((res) => res?.data || []);
  const { placeId, address, dest_type, lat, lng } = places.shift();
  console.log("places", { placeId, destination: address, dest_type, lat, lng });
  return { placeId, destination: address, dest_type, lat, lng };
};
