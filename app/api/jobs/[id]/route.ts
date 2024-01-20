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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectMongoDB();
    const { id } = context.params;
    const payload = await request.json();
    const command = CrawlerCommandZSchema.parse(payload);
    const crawlerJob = await CrawlerJob.findById(id);
    if (!crawlerJob) {
      session.commitTransaction();
      return nextReturn(false, 404, "NOT_FOUND");
    }
    await CrawlerJob.findByIdAndUpdate(id, command, { session }).exec();
    session.commitTransaction();
    return nextReturn(true, 200, "OK");
  } catch (err: any) {
    session.abortTransaction();
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
