import { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { authApi } from "../features/auth/authApi.js";
import homeImage from "../../public/img/home.svg";
import eyeCloseIcon from "../../public/img/eye-close.svg";
{
  /* поменять файл */
}
import eyeOpenIcon from "../../public/img/eye-close.svg";

export function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAppStore();
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    authApi.login();
  };

  return (
    <main className="antialiased min-h-screen flex items-center justify-center line height">
      <Card className="w-full max-w-[489px] p-4 shadow-[0px_2.22px_2.22px_0px_#00000040]">
        {/* Дом */}
        <div className="flex justify-center mb-5">
          <img src={homeImage} alt="Home" className="w-9.5 h-9.5" />
        </div>

        {/* Заголовок */}
        <h1 className="text-[24px] font-semibold text-black mb-5 text-center">
          Добро пожаловать
        </h1>

        <p className="text-gray-500 text-[18px] font-medium text-center mb-5">
          Войдите в корпоративный портал Альфа-Банка
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mb-0">
          {/* Email поле */}
          <div>
            <label className="block text-base font-normal text-[#666666] mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-2 py-1.5 border-[1.66px] border-[#00000040] rounded-lg focus:ring-2 focus:ring-[#FF0404] focus:border-red-500 outline-none transition-all max-w-[459px] max-h-[32px]"
              placeholder="your.email@mail.ru"
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
            />
          </div>

          {/* Пароль поле */}
          <div>
            <label className="block text-base font-normal text-[#666666] mb-2">
              Пароль
            </label>
            <div className="relative max-w-[459px]">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-2 py-1.5 pr-10 border-[1.66px] border-[#00000040] rounded-lg focus:ring-2 focus:ring-[#FF0404] focus:border-red-500 outline-none transition-all max-h-[32px]"
                placeholder="Введите пароль"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                <img
                  src={showPassword ? eyeOpenIcon : eyeCloseIcon}
                  alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  className="w-4.5 h-4.5"
                />
              </button>
            </div>
          </div>

          {/* Чекбокс и ссылка */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-light text-sm text-black cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-[#FF0404] focus:ring-offset-0 accent-[#FF0404]"
              />
              <span>Запомнить меня</span>
            </label>

            <a
              href="#"
              className="text-sm font-light text-black hover:text-black-700 hover:underline transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Логика восстановления пароля
              }}
            >
              Забыли пароль?
            </a>
          </div>

          {/* Ошибка */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Кнопка входа */}
          <button
            className="w-full max-w-[310px] h-[32px] bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505] text-white font-normal text-[12px] rounded-[8px] transition-all text-center border border-black flex items-center justify-center mx-auto"
            type="submit"
          >
            Войти
          </button>
        </form>
      </Card>
    </main>
  );
}
