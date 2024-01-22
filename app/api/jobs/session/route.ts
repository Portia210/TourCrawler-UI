import connectMongoDB from "@/lib/database/client";
import { SessionInputZSchema } from "@/lib/dto/SessionInput.dto";
import sessionService from "@/lib/service/SessionService/SessionService";
import { nextReturn } from "@/lib/utils/api";
import axios from "axios";
import { NextRequest } from "next/server";
const CRAWLER_URL = process.env.CRAWLER_URL || "http://localhost:3003";

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
    execute();
    return nextReturn(id, 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}

const execute = () => {
  axios.post(`${CRAWLER_URL}/travelor/import-hotels`);
  axios.post(`${CRAWLER_URL}/booking/import-hotels`);
};
