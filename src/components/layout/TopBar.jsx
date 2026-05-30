import { CustomSelect } from "../ui/CustomSelect.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTeams } from "../../features/teams/useTeams.js";
import { useAppStore } from "../../store/appStore.js";

import chatButton from "../../../public/img/cpu.svg";
import analyticsButton from "../../../public/img/trending-up.svg";
import meetingsButton from "../../../public/img/phone.svg";

export function TopBar() {
  const { data: teams = [] } = useTeams();

  const { selectedTeamId, setSelectedTeamId } = useAppStore();

  const location = useLocation();
  const navigate = useNavigate();

  const currentNavValue = location.pathname.startsWith("/analytics")
    ? "/analytics/summary"
    : location.pathname;

  const navOptions = [
    {
      value: "/chat",
      icon: chatButton,
      label: "Чат",
    },
    {
      value: "/analytics/summary",
      icon: analyticsButton,
      label: "Аналитика",
    },
    {
      value: "/meetings",
      icon: meetingsButton,
      label: "Встречи",
    },
  ];

  const teamOptions = [
    {
      value: "all",
      label: "Все команды",
    },
    ...teams.map((team) => ({
      value: team.id,
      label: team.name,
    })),
  ];

  return (
    <header className="mx-auto mt-11 mb-10 flex flex-wrap items-center justify-between">
      {/* Селект с иконками */}
      <CustomSelect
        value={currentNavValue}
        onChange={(value) => navigate(value)}
        options={navOptions}
        className="w-[82px] border border-[#C3C0C0] justify-center px-4 py-1"
        dropdownClassName="w-[109px] p-2 pb-[3px]"
        optionClassName="justify-center"
        selectedClassName="gap-2"
        baseOptionClassName="w-[82px] border border-[#C3C0C0] justify-center px-4 py-1 pr-10 mb-[5px]"
        renderOption={(option) => (
          <img src={option.icon} alt={option.label} className="h-6 w-6" />
        )}
      />

      {/* Селект команд */}
      <div className="ml-auto">
        <CustomSelect
          value={selectedTeamId}
          onChange={setSelectedTeamId}
          placeholder="Выбор команды"
          options={teamOptions}
          dropdownAlign="right"
          className="min-w-[130px] border border-[#C3C0C0] justify-center px-4 py-1 text-base"
          dropdownClassName="min-w-[180px] px-[5px] py-[8px]"
          optionClassName="text-base"
        />
      </div>

      {/* <Link
        className="text-sm text-muted hover:text-slate-900"
        to="/login"
      >
        Выйти
      </Link> */}
    </header>
  );
}
