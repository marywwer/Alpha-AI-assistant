import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button.jsx";
import { currentUser } from "../../data/mockData.js";
import { useAppStore } from "../../store/appStore.js";
import { cn } from "../../shared/lib/utils.js";
import { useChatStore } from "../../store/chatStore.js";
import logoImage from "../../../public/img/logo-alfa.svg";
import listButton from "../../../public/img/list.svg";
import editButton from "../../../public/img/edit.svg";
import usersButton from "../../../public/img/users.svg";
import tagButton from "../../../public/img/tag.svg";
import clockButton from "../../../public/img/clock1.svg";

export function Sidebar({ variant = "chat", items = [] }) {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore();
  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`;
  const { chats, activeChatId, createNewChat, selectChat } = useChatStore();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border p-4 transition-all bg-[#EFEFEF]",
        isSidebarCollapsed ? "w-[70px]" : "w-[300px]",
      )}
    >
      <div className="mb-12 flex items-center gap-4">
        <img src={logoImage} alt="logo" className="w-[37px] h-[70px]" />
        {!isSidebarCollapsed && (
          <div className="font-semibold text-[24px]">Чат помощник</div>
        )}
      </div>

      <Button variant="ghost" className="rounded-xl p-1 mb-[75px] w-[35px]" onClick={toggleSidebar}>
          <img src={listButton} alt="list" className="w-[25px] h-[25px]" />
      </Button>

      {/* Кнопка для meetings */}
      {variant === "meetings" && (
        <Button className="mb-[27px] px-1 py-[25px]">
          <img src={clockButton} alt="new-meeting" className="w-[24px] h-[24px]" />
          {!isSidebarCollapsed && "Новая встреча"}
        </Button>
      )}

      {/* Analytics навигация */}
      {variant === "analytics" ? (
        <nav className="space-y-2">
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex gap-[10px] items-center px-3 py-7 text-[18px]",
                isActive ? "bg-[#C3C0C0]" : "bg-transparent",
                isSidebarCollapsed && "justify-center px-0"
              )
            }
            to="/analytics/summary"
          >
            <img src={usersButton} alt="users" className="w-[24px] h-[24px]" />
            {!isSidebarCollapsed && "Сводка"}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex gap-[10px] items-center px-3 py-7 text-[18px]",
                isActive ? "bg-[#C3C0C0]" : "bg-transparent",
                isSidebarCollapsed && "justify-center px-0"
              )
            }
            to="/analytics/roadmap"
          >
            <img src={tagButton} alt="tag" className="w-[24px] h-[24px]" />
            {!isSidebarCollapsed && "Roadmap"}
          </NavLink>
        </nav>
      ) : (
        <>
          {/* Кнопка для чатов (все варианты кроме analytics и meetings) */}
          {variant !== "meetings" && (
            <Button
              onClick={createNewChat}
              className={cn("mb-[27px] px-1 py-[25px]", isSidebarCollapsed && "justify-center")}
            >
              <img src={editButton} alt="edit" className="w-[24px] h-[24px]" />
              {!isSidebarCollapsed && "Новый чат"}
            </Button>
          )}
          
          {/* Заголовок "Ваши встречи" или "Ваши чаты" */}
          {!isSidebarCollapsed && variant !== "analytics" && (
            <p className="mb-[10px] text-[18px] text-[#666666]">
              {variant === "meetings" ? "Ваши встречи" : "Ваши чаты"}
            </p>
          )}
          
          {/* Список элементов */}
          <nav className="transparent-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {(variant === "chat" ? chats : items).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (variant === "chat") {
                    selectChat(item.id);
                  }
                }}
                className={cn(
                  "block w-full truncate px-1 py-2 text-left text-[18px] font-normal hover:bg-[#C3C0C0]",
                  variant === "chat" && item.id === activeChatId && "bg-[#C3C0C0]",
                  isSidebarCollapsed && "invisible",
                )}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </>
      )}

      {/* Блок пользователя внизу */}
      <div className={cn("mt-auto flex items-center gap-4 pt-4", isSidebarCollapsed && "justify-center")}>
        <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#FCD9D9] border border-black text-[20px] font-medium text-[#FF0404]">
          {initials}
        </div>
        {!isSidebarCollapsed && (
          <div>
            <div className="text-[16px] font-medium">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div className="text-[14px] text-[#666666]">{currentUser.role}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
