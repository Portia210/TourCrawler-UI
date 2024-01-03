import mongoose from "mongoose";

const crawlerJobSchema = new mongoose.Schema(
  {
    dataSource: String, // Travelor or Booking
    destination: String,
    checkInDate: Date,
    checkOutDate: Date,
    adult: Number,
    children: Number,
    rooms: Number,
    status: String, // PEDING, RUNNING, COMPELETED, FAILED
    assignedTo: String, // Worker ID
  },
  {
    timestamps: true,
  }
);

const CrawlerJob =
  mongoose.models.CrawlerJob || mongoose.model("CrawlerJob", crawlerJobSchema);
export default CrawlerJob;
