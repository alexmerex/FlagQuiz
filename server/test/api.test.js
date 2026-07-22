const test = require("node:test");
const assert = require("node:assert/strict");
const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs/promises");
const request = require("supertest");
const { JsonStore } = require("../src/store");
const { createApp } = require("../src/app");

async function setup(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "flag-quiz-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const store = await new JsonStore(path.join(directory, "db.json")).initialize();
  return request(createApp({ store, jwtSecret: "test-secret-with-enough-entropy" }));
}

test("health endpoint is available", async (t) => {
  const api = await setup(t); const response = await api.get("/api/health").expect(200);
  assert.equal(response.body.status, "ok");
});

test("register, authenticate, load questions and save a score", async (t) => {
  const api = await setup(t);
  const registered = await api.post("/api/auth/register").send({ username: "LanAnh", password: "secure123" }).expect(201);
  assert.equal(registered.body.user.username, "LanAnh"); assert.ok(registered.body.token);
  await api.post("/api/auth/register").send({ username: "lananh", password: "secure123" }).expect(409);
  const login = await api.post("/api/auth/login").send({ username: "LANANH", password: "secure123" }).expect(200);
  const token = login.body.token;
  const quiz = await api.get("/api/questions?level=easy").set("Authorization", `Bearer ${token}`).expect(200);
  assert.ok(quiz.body.questions.length > 0); assert.equal(quiz.body.questions[0].answers.length, 4);
  const result = { levelId: "easy", score: 700, correctAnswers: 3, totalQuestions: 4 };
  assert.equal((await api.post("/api/scores").set("Authorization", `Bearer ${token}`).send(result).expect(200)).body.isPersonalBest, true);
  assert.equal((await api.post("/api/scores").set("Authorization", `Bearer ${token}`).send({ ...result, score: 500 }).expect(200)).body.isPersonalBest, false);
  const board = await api.get("/api/leaderboard?level=easy").expect(200);
  assert.equal(board.body.scores[0].username, "LanAnh"); assert.equal(board.body.scores[0].score, 700);
});

test("rejects unauthorized and invalid requests", async (t) => {
  const api = await setup(t);
  await api.get("/api/questions?level=easy").expect(401);
  await api.post("/api/auth/register").send({ username: "a", password: "short" }).expect(400);
  const login = await api.post("/api/auth/login").send({ username: "demo", password: "demo1234" }).expect(200);
  await api.post("/api/scores").set("Authorization", `Bearer ${login.body.token}`).send({ levelId: "easy", score: 99999, correctAnswers: 1, totalQuestions: 1 }).expect(400);
  await api.get("/api/leaderboard?level=unknown").expect(400);
});
