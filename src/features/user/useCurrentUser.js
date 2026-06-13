import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../features/auth/authApi.js";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
}