"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
require("dotenv").config();
(0, axios_retry_1.default)(axios_1.default, {
    retries: 5,
    retryDelay: (...arg) => axios_retry_1.default.exponentialDelay(...arg, 5000),
    onRetry(retryCount, err) {
        console.error("api call failed, retrying...", err.toJSON());
        console.log(`Retry attempt #${retryCount}`);
    },
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3003;
const crawlerUrl = process.env.CRAWLERUI_URL || "http://localhost:3001";
const cleanOldData = () => {
    axios_1.default
        .post(`${crawlerUrl}/api/jobs/session/cleanup`, {})
        .then((response) => console.log("cleanOldData response::", response.data))
        .catch((error) => {
        console.error("cleanOldData error::", error);
    });
};
const schedule = "0 0 0 * * *"; // every day at midnight
const schedule2 = "*/15 * * * * *"; // every 15 seconds for testing
node_cron_1.default.schedule(schedule2, function () {
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
//# sourceMappingURL=app.js.map