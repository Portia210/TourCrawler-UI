import mongoose from "mongoose";

const cronJobSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      data: Object,
    },
    startDate: Date, // date excecute job
    lastActive: Date, // last time job is active
    interval: {
      type: String,
      enum: ["ONE_TIME", "SECOND", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"],
      default: "ONE_TIME",
    },
    status: String,
    message: mongoose.Schema.Types.Mixed, // Allow either Object or String
    assignedTo: String, // Worker ID
  },
  {
    timestamps: true,
    typeKey: "$type",
  }
);

const CronJob =
  mongoose.models.CronJob || mongoose.model("CronJob", cronJobSchema);
export default CronJob;
