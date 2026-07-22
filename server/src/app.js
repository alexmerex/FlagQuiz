const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { createToken, authMiddleware } = require("./auth");
const { questions } = require("./questions");

const LEVELS = new Set(["easy", "normal", "hard"]);
const shuffle = (items) => items.map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
const publicUser = (user) => ({ id: user.id, username: user.username });

function validateCredentials(username, password) {
  if (typeof username !== "string" || typeof password !== "string") return "Dữ liệu đăng nhập không hợp lệ.";
  const name = username.trim();
  if (name.length < 3 || name.length > 30) return "Tên người dùng phải có từ 3 đến 30 ký tự.";
  if (/[^\p{L}\p{N}_.-]/u.test(name)) return "Tên người dùng chỉ được chứa chữ, số, dấu chấm, gạch ngang hoặc gạch dưới.";
  if (password.length < 8 || password.length > 72) return "Mật khẩu phải có từ 8 đến 72 ký tự.";
  return null;
}

function createApp({ store, jwtSecret }) {
  const app = express(); const requireAuth = authMiddleware(jwtSecret);
  app.disable("x-powered-by"); app.use(cors()); app.use(express.json({ limit: "16kb" }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { username, password } = req.body || {}; const validationError = validateCredentials(username, password);
      if (validationError) return res.status(400).json({ message: validationError });
      if (store.findUser(username)) return res.status(409).json({ message: "Tên người dùng đã tồn tại." });
      const user = await store.createUser(username, await bcrypt.hash(password, 10));
      res.status(201).json({ token: createToken(user, jwtSecret), user: publicUser(user) });
    } catch (error) { next(error); }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { username, password } = req.body || {};
      if (typeof username !== "string" || typeof password !== "string") return res.status(400).json({ message: "Vui lòng nhập đủ thông tin đăng nhập." });
      const user = store.findUser(username);
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Tên người dùng hoặc mật khẩu không đúng." });
      res.json({ token: createToken(user, jwtSecret), user: publicUser(user) });
    } catch (error) { next(error); }
  });

  app.get("/api/questions", requireAuth, (req, res) => {
    const level = req.query.level;
    if (!LEVELS.has(level)) return res.status(400).json({ message: "Cấp độ không hợp lệ." });
    const selected = shuffle(questions.filter((item) => item.levelId === level)).slice(0, 10).map((item) => ({ ...item, answers: shuffle(item.answers) }));
    res.json({ questions: selected });
  });

  app.post("/api/scores", requireAuth, async (req, res, next) => {
    try {
      const { levelId, score, correctAnswers, totalQuestions } = req.body || {};
      const allIntegers = [score, correctAnswers, totalQuestions].every(Number.isInteger);
      const valid = LEVELS.has(levelId) && allIntegers && totalQuestions >= 1 && totalQuestions <= 10 && correctAnswers >= 0 && correctAnswers <= totalQuestions && score >= 0 && score <= totalQuestions * 300;
      if (!valid) return res.status(400).json({ message: "Kết quả không hợp lệ." });
      res.json(await store.saveScore({ userId: req.auth.sub, levelId, score, correctAnswers, totalQuestions }));
    } catch (error) { next(error); }
  });

  app.get("/api/leaderboard", (req, res) => {
    const level = req.query.level;
    if (!LEVELS.has(level)) return res.status(400).json({ message: "Cấp độ không hợp lệ." });
    res.json({ scores: store.leaderboard(level) });
  });

  app.use((_req, res) => res.status(404).json({ message: "Không tìm thấy API." }));
  app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ message: "Máy chủ gặp lỗi. Vui lòng thử lại." }); });
  return app;
}

module.exports = { createApp, validateCredentials };
