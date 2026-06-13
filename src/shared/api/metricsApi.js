import { API_BASE_URL } from "../config/api.js";

export const metricsApi = {
  async getMetrics({ teamId, metricsKeys }) {
    const response = await fetch(`${API_BASE_URL}/metrics/data`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: teamId === "all" ? null : teamId,
        metricsKeys,
      }),
    });

    if (!response.ok) {
      throw new Error("Не удалось загрузить метрики");
    }

    return response.json();
  },
};