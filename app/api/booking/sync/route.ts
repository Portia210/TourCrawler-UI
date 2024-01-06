import connectMongoDB from "@/lib/database/client";
import BookingHotel from "@/lib/database/model/BookingHotelModel";
import { nextReturn } from "@/utils/api";
import { NextRequest } from "next/server";

/**
 * Sync booking hotel data
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const hotels = await request.json();
    const bookingHotels = hotels.map((hotel: any) => new BookingHotel(hotel));
    await BookingHotel.insertMany(bookingHotels);
    return nextReturn("Synced successfully", 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
