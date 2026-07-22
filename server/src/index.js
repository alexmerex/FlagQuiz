const path = require("node:path");
const { JsonStore } = require("./store");
const { createApp } = require("./app");

const port = Number(process.env.PORT) || 3000;
const jwtSecret = process.env.JWT_SECRET || "flag-quiz-development-secret-change-me";
const dataFile = process.env.DATA_FILE || path.join(__dirname, "..", "data", "db.json");

if (!process.env.JWT_SECRET) console.warn("[server] JWT_SECRET chưa được đặt; đang dùng khóa dành cho môi trường phát triển.");

new JsonStore(dataFile).initialize().then((store) => {
  createApp({ store, jwtSecret }).listen(port, "0.0.0.0", () => console.log(`[server] API đang chạy tại http://localhost:${port}/api`));
}).catch((error) => { console.error("[server] Không thể khởi động:", error); process.exitCode = 1; });
