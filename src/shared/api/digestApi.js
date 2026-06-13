import { API_BASE_URL } from "../config/api.js";

export const digestApi = {
  async getDigestData(teamId) {
    const response = await fetch(`${API_BASE_URL}/digest/data`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: teamId === "all" ? null : teamId,
      }),
    });

    if (!response.ok) {
      throw new Error("Не удалось загрузить roadmap");
    }

    return response.json();
  },
};