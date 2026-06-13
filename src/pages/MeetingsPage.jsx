import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ru } from "date-fns/locale";
import { format, getMonth, getYear } from "date-fns";
import { Calendar, Clock, Search } from "lucide-react";
import filterIcon from "../../public/img/filter.svg";

import "react-datepicker/dist/react-datepicker.css";

import {
  useCreateEmptyMeeting,
  useImportKonturMeeting,
  useKonturMeetings,
} from "../features/meetings/useMeetings.js";

export function MeetingsPage() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedKonturMeetingId, setSelectedKonturMeetingId] = useState(null);
  const [search, setSearch] = useState("");

  const { data: konturMeetings = [] } = useKonturMeetings();
  const createEmptyMeeting = useCreateEmptyMeeting();
  const importKonturMeeting = useImportKonturMeeting();

  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const meetingsByDate = useMemo(() => {
    if (!selectedDateKey) return [];

    return konturMeetings.filter((meeting) => {
      const meetingDate = format(new Date(meeting.startedAt), "yyyy-MM-dd");

      const matchesDate = meetingDate === selectedDateKey;
      const matchesSearch = meeting.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchesDate && matchesSearch;
    });
  }, [konturMeetings, selectedDateKey, search]);

  const hasSelectedDate = Boolean(selectedDate);
  const hasMeetings = meetingsByDate.length > 0;

  const handleContinue = async () => {
    if (!selectedKonturMeetingId) return;

    const response = await importKonturMeeting.mutateAsync({
      konturMeetingId: selectedKonturMeetingId,
    });

    navigate(`/meetings/${response.meetingId}`);
  };

  const handleCreateManual = async () => {
    const response = await createEmptyMeeting.mutateAsync();

    navigate(`/meetings/${response.meetingId}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-start justify-center pt-12">
      <div className="w-full max-w-[678px] rounded-xl border border-[#C3C0C0] bg-white p-4 shadow">
        <h1 className="text-[24px] font-semibold">
          Создать или выбрать встречу
        </h1>

        <p className="mt-1 text-[#666]">
          Выберите встречу из Контур.Толк или создайте новую вручную
        </p>

        <div className="mt-7">
          <div className="mb-2.5 flex items-center gap-2 text-[20px] font-medium">
            <Calendar size={24} />
            <span>Выбрать из Контур.Толк</span>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedKonturMeetingId(null);
              }}
              locale={ru}
              dateFormat="dd.MM.yyyy"
              calendarClassName="custom-calendar"
              popperClassName="custom-calendar-popper"
              renderCustomHeader={({ date, changeYear, changeMonth }) => (
                <CustomCalendarHeader
                  date={date}
                  changeYear={changeYear}
                  changeMonth={changeMonth}
                />
              )}
              customInput={
                <button
                  type="button"
                  className="ml-1 flex items-center gap-1.5 rounded-lg border border-[#C3C0C0] bg-[#F8F8F8] px-2 text-[16px] font-normal text-[#666] hover:bg-[#EDEDED]"
                >
                  <img src={filterIcon} alt="Filter" className="h-3.5 w-3.5" />
                  Календарь
                </button>
              }
            />
          </div>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-[30px] w-full rounded-lg bg-[#F8F8F8] hover:bg-[#EDEDED] border border-[#C3C0C0] pl-9 pr-3 outline-none text-[#666]"
              placeholder="Поиск встреч..."
            />
          </div>

          {hasSelectedDate && (
            <div className="mt-4 space-y-3">
              {hasMeetings ? (
                meetingsByDate.map((meeting) => {
                  const isActive =
                    selectedKonturMeetingId === meeting.konturMeetingId;

                  return (
                    <button
                      key={meeting.konturMeetingId}
                      type="button"
                      onClick={() =>
                        setSelectedKonturMeetingId((prevId) =>
                          prevId === meeting.konturMeetingId
                            ? null
                            : meeting.konturMeetingId,
                        )
                      }
                      className={[
                        "w-full rounded-lg p-3 text-left transition",
                        isActive
                          ? "bg-[#FFAAAA] shadow-custom active:shadow-custom"
                          : "bg-white hover:bg-[#FCD9D9] hover:shadow-custom",
                      ].join(" ")}
                    >
                      <p className="text-[18px]">{meeting.description}</p>

                      <div className="mt-5 flex items-center gap-3.5">
                        <Badge
                          className={isActive ? "bg-transparent" : ""}
                          icon={<Calendar size={24} />}
                        >
                          {format(new Date(meeting.startedAt), "dd MMMM yyyy", {
                            locale: ru,
                          })}
                        </Badge>

                        <Badge
                          className={isActive ? "bg-transparent" : ""}
                          icon={<Clock size={24} />}
                        >
                          {format(new Date(meeting.startedAt), "HH:mm")}
                        </Badge>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-[18px] text-[#777]">
                  Встреч с нужной датой нет.
                </p>
              )}
            </div>
          )}

          {hasMeetings && (
            <button
              type="button"
              disabled={!selectedKonturMeetingId}
              onClick={handleContinue}
              className="mt-6 h-[32px] w-full rounded-lg border border-[#C3C0C0] bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505] text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Продолжить с выбранной встречей
            </button>
          )}
        </div>

        {!hasMeetings && (
          <div className="mt-6">
            <div className="mb-2.5 flex items-center gap-2 text-[20px] font-medium">
              <Calendar size={24} />
              <span>Создать вручную</span>
            </div>

            <p className="text-[#666]">
              Создайте встречу без подключения к Контур.Толк, Вы сможете
              подключить её позже.
            </p>

            <button
              type="button"
              onClick={handleCreateManual}
              className="mt-9 h-[32px] w-full rounded-lg border border-[#C3C0C0] bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505] text-white"
            >
              Создать встречу вручную
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const YEARS = Array.from(
  { length: getYear(new Date()) - 2015 + 1 },
  (_, index) => getYear(new Date()) - index,
);

function CustomCalendarHeader({ date, changeYear, changeMonth }) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const currentMonth = getMonth(date);
  const currentYear = getYear(date);

  return (
    <div className="custom-calendar-header">
      <div className="relative">
        <button
          type="button"
          className="calendar-header-button"
          onClick={() => {
            setIsMonthOpen((prev) => !prev);
            setIsYearOpen(false);
          }}
        >
          {MONTHS[currentMonth]}
          <span className={isMonthOpen ? "arrow open" : "arrow"} />
        </button>

        {isMonthOpen && (
          <div className="calendar-dropdown month-dropdown">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                type="button"
                onClick={() => {
                  changeMonth(index);
                  setIsMonthOpen(false);
                }}
                className={index === currentMonth ? "active" : ""}
              >
                {month}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          className="calendar-header-button"
          onClick={() => {
            setIsYearOpen((prev) => !prev);
            setIsMonthOpen(false);
          }}
        >
          {currentYear}
          <span className={isYearOpen ? "arrow open" : "arrow"} />
        </button>

        {isYearOpen && (
          <div className="calendar-dropdown year-dropdown">
            {YEARS.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  changeYear(year);
                  setIsYearOpen(false);
                }}
                className={year === currentYear ? "active" : ""}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ icon, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-3.5 rounded-lg border border-[#C3C0C0] px-2 text-[#666] bg-[#F8F8F8] ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
