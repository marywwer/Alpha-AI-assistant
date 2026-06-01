import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "./useAuth.js";
import { useAppStore } from "../../store/appStore.js";
import { useEffect } from "react";

export function AuthProvider() {
  {/* Временный пропуск авторизации для удобства разработки */}
  const DEV_AUTH_BYPASS = import.meta.env.VITE_DEV_AUTH_BYPASS === "true";

  const { data: user, isLoading, isError } = useCurrentUser();
  const { setUser } = useAppStore();

  {/* Временный пропуск авторизации для удобства разработки */}
  if (DEV_AUTH_BYPASS) {
    return <Outlet />;
  }

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