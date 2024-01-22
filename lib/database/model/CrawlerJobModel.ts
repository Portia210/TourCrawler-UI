import mongoose from "mongoose";
import { DataSources, JobStatus } from "../shared";

const crawlerJobSchema = new mongoose.Schema(
  {
    dataSource: DataSources, // Travelor or Booking
    sessionId: String,
    destination: Object,
    checkInDate: Date,
    checkOutDate: Date,
    guests: String,
    adult: Number,
    children: Number,
    childrenAges: Array,
    rooms: Number,
    status: {
      enum: JobStatus,
      default: JobStatus.PENDING,
    },
    message: mongoose.Schema.Types.Mixed, // Allow either Object or String
    assignedTo: String, // Worker ID
  },
  {
    timestamps: true,
    typeKey: "$type",
  }
);

const CrawlerJob =
  mongoose.models.CrawlerJob || mongoose.model("CrawlerJob", crawlerJobSchema);
export default CrawlerJob;
