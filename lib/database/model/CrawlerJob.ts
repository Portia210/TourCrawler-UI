import mongoose from "mongoose";

const crawlerJobSchema = new mongoose.Schema(
  {
    dataSource: String, // Travelor or Booking
    destination: Object,
    checkInDate: Date,
    checkOutDate: Date,
    guests: String,
    status: String, // PEDING, RUNNING, COMPELETED, FAILED
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
