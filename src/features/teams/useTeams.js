import { useQuery } from "@tanstack/react-query";
import { teamApi } from "../../shared/api/teamApi.js";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: teamApi.getTeams,
  });
}
