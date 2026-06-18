import { useQuery } from "@tanstack/react-query";
/*import { teamApi } from "../../shared/api/teamApi.js";*/
import { api } from "../../shared/api/mockApi.js";

export function useTeams() {
  return useQuery({ queryKey: ["teams"], queryFn: api.getTeams });
}

/*export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: teamApi.getTeams,
  });
}*/
