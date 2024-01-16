import express from "express";
import cron from "node-cron";
import axios from "axios";
import axiosRetry from "axios-retry";
require("dotenv").config();

axiosRetry(axios, {
  retries: 5,
  retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 5000),
  onRetry(retryCount, err) {
    console.error("api call failed, retrying...", err.toJSON());
    console.log(`Retry attempt #${retryCount}`);
  },
});

const app = express();
const port = process.env.PORT || 3003;
const crawlerUrl = process.env.CRAWLERUI_URL || "http://localhost:3001";

const cleanOldData = () => {
  axios
    .post(`${crawlerUrl}/api/jobs/session/cleanup`, {})
    .then((response) => console.log("cleanOldData response::", response.data))
    .catch((error) => {
      console.error("cleanOldData error::", error);
    });
};

const schedule = "0 0 0 * * *"; // every day at midnight
const schedule2 = "*/15 * * * * *"; // every 15 seconds for testing

cron.schedule(schedule2, function () {
  console.log("---------------------");
  console.log("Cleaning old data");
  cleanOldData();
});

app.get("/", (req, res) => {
  res.send(`Up time: ${process.uptime()}`);
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
