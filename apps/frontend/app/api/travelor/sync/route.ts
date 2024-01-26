import connectMongoDB from "@/lib/database/client";
import TravelorHotel from "@/lib/database/model/TravelorHotelModel";
import { nextReturn } from "@/lib/utils/api";
import { NextRequest } from "next/server";

/**
 * Sync travelor hotel data
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const hotels = await request.json();
    const bulkOps = hotels.map((hotel: any) => ({
      updateOne: {
        filter: {
          travelor_link: hotel?.travelor_link,
        },
        update: {
          $set: {
            ...hotel,
          },
        },
        upsert: true,
      },
    }));
    await TravelorHotel.bulkWrite(bulkOps);
    return nextReturn("Synced successfully", 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
