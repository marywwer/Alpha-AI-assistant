import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAppStore } from "../../store/appStore.js";
import { useCurrentUser } from "./useAuth.js";

export function AuthProvider() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { setUser } = useAppStore();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          className="h-10 w-10 animate-spin"
          style={{ color: "#FF0404" }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="rounded-lg border border-[#D9D9D9] bg-white p-6 text-center shadow-md">
          <p className="text-[18px] font-semibold">
            Не удалось получить пользователя
          </p>
          <p className="mt-2 text-[#666]">
            Сервер авторизации сейчас недоступен.
          </p>

          <button
            type="button"
            onClick={() => {
              const returnUrl = `${window.location.origin}${window.location.pathname}`;

              window.location.href = `https://doggedly-succinct-ridgeback.cloudpub.ru/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
            }}
            className="mt-4 rounded-lg bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505] px-4 py-1 text-white"
          >
            Войти заново
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
