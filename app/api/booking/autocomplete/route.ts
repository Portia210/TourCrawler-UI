import { nextReturn } from "@/lib/utils/api";
import {
  bookingAutoComplete,
  filterBookingResult,
} from "@/lib/utils/bookingAutoComplete";
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
