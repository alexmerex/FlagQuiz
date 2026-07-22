const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");

class JsonStore {
  constructor(filePath) { this.filePath = path.resolve(filePath); this.data = null; this.writeQueue = Promise.resolve(); }

  async initialize() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try { this.data = JSON.parse(await fs.readFile(this.filePath, "utf8")); }
    catch (error) {
      if (error.code !== "ENOENT") throw error;
      this.data = { users: [{ id: crypto.randomUUID(), username: "demo", usernameKey: "demo", passwordHash: await bcrypt.hash("demo1234", 10), createdAt: new Date().toISOString() }], scores: [] };
      await this.persist();
    }
    if (!Array.isArray(this.data.users) || !Array.isArray(this.data.scores)) throw new Error("Invalid data file format");
    return this;
  }

  findUser(username) { const key = username.trim().toLocaleLowerCase("vi"); return this.data.users.find((user) => user.usernameKey === key); }
  findUserById(id) { return this.data.users.find((user) => user.id === id); }

  async createUser(username, passwordHash) {
    const user = { id: crypto.randomUUID(), username: username.trim(), usernameKey: username.trim().toLocaleLowerCase("vi"), passwordHash, createdAt: new Date().toISOString() };
    this.data.users.push(user); await this.persist(); return user;
  }

  async saveScore({ userId, levelId, score, correctAnswers, totalQuestions }) {
    const existing = this.data.scores.find((item) => item.userId === userId && item.levelId === levelId);
    const isPersonalBest = !existing || score > existing.score;
    if (isPersonalBest) {
      const value = { userId, levelId, score, correctAnswers, totalQuestions, achievedAt: new Date().toISOString() };
      if (existing) Object.assign(existing, value); else this.data.scores.push(value);
      await this.persist();
    }
    return { isPersonalBest, bestScore: isPersonalBest ? score : existing.score };
  }

  leaderboard(levelId, limit = 20) {
    return this.data.scores.filter((item) => item.levelId === levelId).sort((a, b) => b.score - a.score || a.achievedAt.localeCompare(b.achievedAt)).slice(0, limit).map((item, index) => ({ ...item, position: index + 1, username: this.findUserById(item.userId)?.username || "Người chơi" }));
  }

  async persist() {
    this.writeQueue = this.writeQueue.then(() => fs.writeFile(this.filePath, `${JSON.stringify(this.data, null, 2)}\n`, "utf8"));
    return this.writeQueue;
  }
}

module.exports = { JsonStore };
