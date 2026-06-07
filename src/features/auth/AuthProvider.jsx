import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "../../store/appStore.js";
import { useCurrentUser } from "./useAuth.js";

export function AuthProvider() {
  {
    /* Временный пропуск авторизации для удобства разработки */
  }
  const DEV_AUTH_BYPASS = import.meta.env.VITE_DEV_AUTH_BYPASS === "true";

  const { data: user, isLoading, isError } = useCurrentUser();
  const { setUser } = useAppStore();

  {
    /* Временный пропуск авторизации для удобства разработки */
  }
  if (DEV_AUTH_BYPASS) {
    return <Outlet />;
  }

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return <div className="flex min-h-[60vh] w-full items-center justify-center">Загрузка...</div>;
  }

  if (isError) {
    const returnUrl = `${window.location.origin}${window.location.pathname}`;

    window.location.href = `https://doggedly-succinct-ridgeback.cloudpub.ru/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;

    return null;
  }

  return <Outlet />;
}
