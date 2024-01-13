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
  try {
    await connectMongoDB();
    const { id } = context.params;
    const payload = await request.json();
    const command = CrawlerCommandZSchema.parse(payload);
    await CrawlerJob.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      command
    ).exec();
    return nextReturn("Success", 200, "OK");
  } catch (err: any) {
    return nextReturn(err?.message || err, 500, "INTERNAL_SERVER_ERROR");
  }
}
