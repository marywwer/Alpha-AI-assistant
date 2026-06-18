import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button.jsx";
import { useCurrentUser } from "../../features/user/useCurrentUser.js";
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
  const { data: currentUser } = useCurrentUser();

  const firstName = currentUser?.name || "";
  const lastName = currentUser?.surname || "";
  const role = currentUser?.roleName || "";

  const initials = `${firstName[0] || ""}${lastName[0] || ""}`;

  const { isSidebarCollapsed, toggleSidebar } = useAppStore();
  const { chats, activeChatId, createNewChat, selectChat } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItemClass = cn(
    "flex w-full items-center gap-[10px] py-[25px] text-[18px] hover:bg-[#C3C0C0]",
    isSidebarCollapsed
      ? "justify-center px-0"
      : "-mx-4 w-[calc(100%+32px)] px-4",
  );

  const navItemClass = cn(
    "flex w-full items-center gap-[10px] py-7 text-[18px] hover:bg-[#C3C0C0]",
    isSidebarCollapsed
      ? "justify-center px-0"
      : "-mx-4 w-[calc(100%+32px)] px-4",
  );

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border transition-all bg-[#EFEFEF]",
        isSidebarCollapsed ? "w-[70px] px-0 py-4" : "w-[300px] p-4",
      )}
    >
      <div
        className={cn(
          "mb-12 flex items-center gap-4",
          isSidebarCollapsed && "justify-center",
        )}
      >
        <img src={logoImage} alt="logo" className="w-[37px] h-[70px]" />
        {!isSidebarCollapsed && (
          <div className="font-semibold text-[24px]">Чат помощник</div>
        )}
      </div>

      <Button
        variant="ghost"
        className={cn(
          "mb-[75px] rounded-xl p-1 w-[35px]",
          isSidebarCollapsed && "mx-auto",
        )}
        onClick={toggleSidebar}
      >
        <img src={listButton} alt="list" className="w-[25px] h-[25px]" />
      </Button>

      {variant === "meetings" && (
        <Button
          onClick={() => navigate("/meetings")}
          className={cn(
            "mb-[27px]",
            menuItemClass,
            location.pathname === "/meetings" && "bg-[#C3C0C0]",
          )}
        >
          <img
            src={clockButton}
            alt="new-meeting"
            className="w-[24px] h-[24px]"
          />
          {!isSidebarCollapsed && "Новая встреча"}
        </Button>
      )}

      {variant === "analytics" ? (
        <nav className="space-y-2">
          <NavLink
            to="/analytics/summary"
            className={({ isActive }) =>
              cn(navItemClass, isActive && "bg-[#C3C0C0]")
            }
          >
            <img src={usersButton} alt="users" className="w-[24px] h-[24px]" />
            {!isSidebarCollapsed && "Сводка"}
          </NavLink>

          <NavLink
            to="/analytics/roadmap"
            className={({ isActive }) =>
              cn(navItemClass, isActive && "bg-[#C3C0C0]")
            }
          >
            <img src={tagButton} alt="tag" className="w-[24px] h-[24px]" />
            {!isSidebarCollapsed && "Roadmap"}
          </NavLink>
        </nav>
      ) : (
        <>
          {variant !== "meetings" && (
            <Button
              onClick={createNewChat}
              className={cn(
                "mb-[27px]",
                menuItemClass,
                !activeChatId && "bg-[#C3C0C0]",
              )}
            >
              <img src={editButton} alt="edit" className="w-[24px] h-[24px]" />
              {!isSidebarCollapsed && "Новый чат"}
            </Button>
          )}

          {!isSidebarCollapsed && (
            <p className="mb-[10px] text-[18px] text-[#666666]">
              {variant === "meetings" ? "Ваши встречи" : "Ваши чаты"}
            </p>
          )}

          <nav
            className={cn(
              "transparent-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto",
              !isSidebarCollapsed && "-mx-4",
            )}
          >
            {(variant === "chat" ? chats : items).map((item) => {
              const isActiveChat =
                variant === "chat" && item.id === activeChatId;

              const isActiveMeeting =
                variant === "meetings" &&
                location.pathname.startsWith(`/meetings/${item.id}`);

              const itemTitle =
                variant === "meetings" ? getMeetingTitle(item) : item.title;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (variant === "chat") {
                      selectChat(item.id);
                    }

                    if (variant === "meetings") {
                      navigate(`/meetings/${item.id}`);
                    }
                  }}
                  className={cn(
                    "block w-full truncate py-2 text-left text-[18px] font-normal hover:bg-[#C3C0C0]",
                    isSidebarCollapsed ? "px-0 text-center" : "px-4",
                    (isActiveChat || isActiveMeeting) && "bg-[#C3C0C0]",
                    isSidebarCollapsed && "invisible",
                  )}
                >
                  {itemTitle}
                </button>
              );
            })}
          </nav>
        </>
      )}

      <div
        className={cn(
          "mt-auto flex items-center gap-4 pt-4",
          isSidebarCollapsed && "justify-center px-0",
        )}
      >
        <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#FCD9D9] border border-black text-[20px] font-medium text-[#FF0404]">
          {initials}
        </div>

        {!isSidebarCollapsed && (
          <div>
            <div className="text-[16px] font-medium">
              {firstName} {lastName}
            </div>
            <div className="text-[14px] text-[#666666]">{role}</div>
          </div>
        )}
      </div>
    </aside>
  );
}

function getMeetingTitle(meeting) {
  const title = meeting?.name?.trim() || meeting?.title?.trim();

  if (!title) return "Информация о встрече";

  if (title.startsWith("Неизвестная встреча")) {
    return "Информация о встрече";
  }

  return title;
}
