import { useQuery } from "@tanstack/react-query";
import { authApi } from "./authApi.js";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}