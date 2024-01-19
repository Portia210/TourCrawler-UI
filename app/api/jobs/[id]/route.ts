import connectMongoDB from "@/lib/database/client";
import CrawlerJob from "@/lib/database/model/CrawlerJobModel";
import { CrawlerCommandZSchema } from "@/lib/dto/CrawlerCommand.dto";
import { nextReturn } from "@/lib/utils/api";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

/**
 * Create job
 */
export async function PUT(request: NextRequest, context: any) {
  await connectMongoDB();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = context.params;
    const payload = await request.json();
    const command = CrawlerCommandZSchema.parse(payload);
    const crawlerJob = await CrawlerJob.findById(id).session(session).exec();
    if (crawlerJob.status !== "PENDING") {
      session.commitTransaction();
      return nextReturn(false, 200, "OK");
    }
    await CrawlerJob.findByIdAndUpdate(id, command, { session }).exec();
    session.commitTransaction();
    return nextReturn(true, 200, "OK");
  } catch (err: any) {
    session.abortTransaction();
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
