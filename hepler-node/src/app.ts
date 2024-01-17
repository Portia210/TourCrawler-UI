import axios from "axios";
import axiosRetry from "axios-retry";
import express from "express";
import cron from "node-cron";
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
  console.log("Cleaning old data");
  axios
    .post(`${crawlerUrl}/api/jobs/session/cleanup`, {})
    .then((response) => console.log("cleanOldData response::", response.data))
    .catch((error) => {
      console.error("cleanOldData error::", error);
    });
};

const updateCurrencies = () => {
  console.log("Updating currencies");
  axios
    .post(`${crawlerUrl}/api/currency`, {})
    .then((response) =>
      console.log("updateCurrencies response::", response.data)
    )
    .catch((error) => {
      console.error("updateCurrencies error::", error);
    });
};

const schedule = "0 0 0 * * *"; // every day at midnight
const schedule2 = "*/30 * * * * *"; // every 30 seconds for testing

cron.schedule(schedule, function () {
  console.log("---------------------");
  cleanOldData();
  updateCurrencies();
});

app.get("/", (req, res) => {
  res.send(`Up time: ${process.uptime()}`);
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
