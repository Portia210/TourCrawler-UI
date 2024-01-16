import express from "express";
import cron from "node-cron";
import axios from "axios";
require("dotenv").config();

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

const schedule = "0 0 0 * * *";

cron.schedule("*/15 * * * * *", function () {
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
