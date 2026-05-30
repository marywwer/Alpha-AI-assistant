import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "./useAuth.js";
import { useAppStore } from "../../store/appStore.js";
import { useEffect } from "react";

export function AuthProvider() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { setUser } = useAppStore();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return <div className="p-8">Загрузка...</div>;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}