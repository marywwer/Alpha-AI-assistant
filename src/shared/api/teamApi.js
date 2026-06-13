import { request } from "./baseApi.js";

export const teamApi = {
  getTeams: () => request("/team/all"),
};