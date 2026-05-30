import { API_BASE_URL } from "../../shared/config/api.js";

export const authApi = {
  login() {
    const returnUrl = `${window.location.origin}/chat`;

    window.location.href = `${API_BASE_URL}/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  },

  logout() {
    const returnUrl = `${window.location.origin}/login`;

    window.location.href = `${API_BASE_URL}/auth/logout?returnUrl=${encodeURIComponent(returnUrl)}`;
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Пользователь не авторизован");
    }

    return response.json();
  },
};