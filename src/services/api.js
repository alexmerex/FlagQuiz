import { API_URL } from "../config/api";

const REQUEST_TIMEOUT = 10000;

async function request(path, { token, ...options } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Không thể kết nối đến máy chủ.");
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Máy chủ phản hồi quá lâu. Vui lòng thử lại.");
    }
    if (error instanceof TypeError) {
      throw new Error("Không thể kết nối API. Hãy kiểm tra server và địa chỉ mạng.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  login: (credentials) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (credentials) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(credentials) }),
  getQuestions: (level, token) => request(`/questions?level=${encodeURIComponent(level)}`, { token }),
  submitScore: (result, token) =>
    request("/scores", { method: "POST", token, body: JSON.stringify(result) }),
  getLeaderboard: (level) => request(`/leaderboard?level=${encodeURIComponent(level)}`),
};
