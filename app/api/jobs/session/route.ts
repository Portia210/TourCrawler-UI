import connectMongoDB from "@/lib/database/client";
import { SessionInputZSchema } from "@/lib/dto/SessionInput.dto";
import sessionService from "@/lib/service/SessionService/SessionService";
import { nextReturn } from "@/lib/utils/api";
import { NextRequest } from "next/server";

/**
 * Create job
 */
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const payload = await request.json();
    const sessionInput = SessionInputZSchema.parse(payload);
    let id = await sessionService.checkIfSessionExist(sessionInput);
    if (!id) {
      console.log("Creating new session");
      id = await sessionService.createSession(sessionInput);
    } else console.log("Session existed returning...", id);
    return nextReturn(id, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
