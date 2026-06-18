import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  eachMonthOfInterval,
  endOfWeek,
  endOfYear,
  format,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { ru } from "date-fns/locale";
import vectorImage from "../../../public/img/vector.svg";

const ROW_HEIGHT = 132;

const SIDEBAR_WIDTH = 220;
const BOARD_WIDTH = 1356;
const BOARD_HEIGHT = 1148;
const HEADER_HEIGHT = 85;
const BOARD_BODY_TOP = 150;

const WEEK_WIDTH = 217;
const WEEK_HEIGHT = 50;
const WEEK_GAP = 3;
const MONTH_GAP = 4;
const WEEKS_IN_MONTH = 4;

const DAY_COLUMNS_IN_WEEK = 7;

const DAY_WIDTH = WEEK_WIDTH / DAY_COLUMNS_IN_WEEK; // 31px
const WEEK_SCROLL_WIDTH = DAY_WIDTH * 7;

const MONTH_WIDTH = WEEK_WIDTH * WEEKS_IN_MONTH + WEEK_GAP * 3;
const MONTH_HEADER_WIDTH = MONTH_WIDTH;

const statusLabel = {
  1: "В работе",
  2: "Выполнено",
  3: "Готово",
};

const ItemStatus = {
  IN_PROGRESS: 1,
  DONE: 2,
  CLOSED: 3,
};

const priorityLabel = {
  1: "Низкий",
  2: "Средний",
  3: "Высокий",
};

const laneColors = [
  "bg-[#FFE6A7]",
  "bg-[#61E47B]",
  "bg-[#BDE5FF]",
  "bg-[#DCC8FF]",
  "bg-[#FFB6BC]",
];

const ROADMAP_COLORS = [
  {
    name: "yellow",
    lane: "bg-[#FFE7AA]",
    active: "bg-[#FFE7AA]",
    activeExpanded: "bg-[#FFD365]",
    overdue: "bg-[#FFF3D4]",
    overdueExpanded: "bg-[#FFF3D4]",
  },
  {
    name: "green",
    lane: "bg-[#94F8A4]",
    active: "bg-[#94F8A4]",
    activeExpanded: "bg-[#64E778]",
    overdue: "bg-[#CDF4D3]",
    overdueExpanded: "bg-[#CDF4D3]",
  },
  {
    name: "blue",
    lane: "bg-[#B7E0FF]",
    active: "bg-[#B7E0FF]",
    activeExpanded: "bg-[#95D2FF]",
    overdue: "bg-[#DEEEF9]",
    overdueExpanded: "bg-[#DEEEF9]",
  },
  {
    name: "purple",
    lane: "bg-[#DFD1FF]",
    active: "bg-[#DFD1FF]",
    activeExpanded: "bg-[#C8AFFF]",
    overdue: "bg-[#F0E9FD]",
    overdueExpanded: "bg-[#F0E9FD]",
  },
  {
    name: "pink",
    lane: "bg-[#FFC1C1]",
    active: "bg-[#FFC1C1]",
    activeExpanded: "bg-[#F89E9E]",
    overdue: "bg-[#FFE3E3]",
    overdueExpanded: "bg-[#FFE3E3]",
  },
];

function toDate(value) {
  return new Date(`${value}T00:00:00`);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getDominantMonth(weekStart) {
  const daysByMonth = {};

  for (let i = 0; i < 7; i += 1) {
    const day = addDays(weekStart, i);
    const monthKey = format(day, "yyyy-MM");

    daysByMonth[monthKey] = (daysByMonth[monthKey] ?? 0) + 1;
  }

  return Object.entries(daysByMonth).sort((a, b) => b[1] - a[1])[0][0];
}

function getDaysBetween(start, end) {
  return differenceInCalendarDays(new Date(end), new Date(start)) + 1;
}

function getYearCalendar(year = new Date().getFullYear()) {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(yearStart);

  const firstWeekStart = startOfWeek(yearStart, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(yearEnd, { weekStartsOn: 1 });

  const weeks = [];
  let currentWeekStart = firstWeekStart;

  while (!isAfter(currentWeekStart, lastWeekStart)) {
    const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    const dominantMonthKey = getDominantMonth(currentWeekStart);

    const [dominantYear, dominantMonth] = dominantMonthKey
      .split("-")
      .map(Number);

    if (dominantYear === year) {
      weeks.push({
        id: `${format(currentWeekStart, "yyyy-MM-dd")}-${format(
          currentWeekEnd,
          "yyyy-MM-dd",
        )}`,
        dominantMonthKey,
        monthIndex: dominantMonth - 1,
        startDate: format(currentWeekStart, "yyyy-MM-dd"),
        endDate: format(currentWeekEnd, "yyyy-MM-dd"),
        dates: `${format(currentWeekStart, "dd.MM")}-${format(
          currentWeekEnd,
          "dd.MM",
        )}`,
      });
    }

    currentWeekStart = addDays(currentWeekStart, 7);
  }

  const monthMap = new Map();

  weeks.forEach((week) => {
    if (!monthMap.has(week.dominantMonthKey)) {
      const [monthYear, monthNumber] = week.dominantMonthKey
        .split("-")
        .map(Number);

      const monthDate = new Date(monthYear, monthNumber - 1, 1);

      monthMap.set(week.dominantMonthKey, {
        id: week.dominantMonthKey,
        title: capitalize(format(monthDate, "LLLL", { locale: ru })),
        monthIndex: monthNumber - 1,
        weeks: [],
      });
    }

    const month = monthMap.get(week.dominantMonthKey);

    month.weeks.push({
      ...week,
      weekIndex: month.weeks.length,
      title: `Неделя ${month.weeks.length + 1}`,
    });
  });

  const months = Array.from(monthMap.values());

  const resultWeeks = months.flatMap((month) => month.weeks);

  return {
    startDate: format(firstWeekStart, "yyyy-MM-dd"),
    endDate: format(
      endOfWeek(lastWeekStart, { weekStartsOn: 1 }),
      "yyyy-MM-dd",
    ),
    months,
    weeks: resultWeeks,
  };
}

function getMonthWidth(month) {
  return (
    month.weeks.length * WEEK_WIDTH +
    Math.max(month.weeks.length - 1, 0) * WEEK_GAP
  );
}

function getTaskPosition(startDate, endDate, calendar) {
  const taskStart = new Date(`${startDate}T00:00:00`);
  const taskEnd = new Date(`${endDate}T00:00:00`);
  const dayWidth = WEEK_WIDTH / 7;

  const startWeek = calendar.weeks.find((week) => {
    const weekStart = new Date(`${week.startDate}T00:00:00`);
    const weekEnd = new Date(`${week.endDate}T23:59:59`);

    return taskStart >= weekStart && taskStart <= weekEnd;
  });

  const endWeek = calendar.weeks.find((week) => {
    const weekStart = new Date(`${week.startDate}T00:00:00`);
    const weekEnd = new Date(`${week.endDate}T23:59:59`);

    return taskEnd >= weekStart && taskEnd <= weekEnd;
  });

  if (!startWeek || !endWeek) {
    return {
      left: 0,
      width: WEEK_WIDTH,
    };
  }

  const startDayIndex = differenceInCalendarDays(
    taskStart,
    new Date(`${startWeek.startDate}T00:00:00`),
  );

  const endDayIndex = differenceInCalendarDays(
    taskEnd,
    new Date(`${endWeek.startDate}T00:00:00`),
  );

  const left =
    getWeekLeft(startWeek, calendar.months) + startDayIndex * dayWidth;

  const right =
    getWeekLeft(endWeek, calendar.months) + (endDayIndex + 1) * dayWidth;

  return {
    left,
    width: Math.max(right - left, 210),
  };
}

function getTaskState(item) {
  const today = new Date();

  if (item.completedAt) {
    return "completed";
  }

  const deadline = new Date(item.endDate);

  if (deadline < today) {
    return "overdue";
  }

  return "active";
}

function getWeekLeft(week, months) {
  const month = months.find((item) => item.id === week.dominantMonthKey);

  if (!month) return 0;

  return getMonthLeft(month, months) + week.weekIndex * (WEEK_WIDTH + WEEK_GAP);
}

function getMonthLeft(month, months) {
  let left = 0;

  for (const currentMonth of months) {
    if (currentMonth.id === month.id) break;

    left += getMonthWidth(currentMonth) + MONTH_GAP;
  }

  return left;
}

function getRoadmapColor(index) {
  return ROADMAP_COLORS[index % ROADMAP_COLORS.length];
}

function isOverdue(item) {
  if (item.completedAt) return false;

  const today = new Date();
  const deadline = new Date(`${item.endDate}T23:59:59`);

  return deadline < today;
}

function getTaskCardColor(item, isExpanded, color) {
  const isCompleted = Boolean(item.completedAt);

  if (isCompleted && isExpanded) return color.overdueExpanded;
  if (isCompleted && !isExpanded) return color.overdue;

  const overdue = isOverdue(item);

  if (overdue && isExpanded) return color.overdueExpanded;
  if (overdue && !isExpanded) return color.overdue;
  if (!overdue && isExpanded) return color.activeExpanded;

  return color.active;
}

function formatDate(date) {
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getWeekHeaders(startDate, endDate) {
  const result = [];
  let current = toDate(startDate);
  const end = toDate(endDate);
  let weekIndex = 1;

  while (current <= end) {
    const weekStart = new Date(current);
    const weekEnd = addDays(weekStart, 4);

    result.push({
      id: `${weekStart.toISOString()}-${weekEnd.toISOString()}`,
      title: `Неделя ${weekIndex}`,
      dates: `${formatDate(weekStart)}-${formatDate(weekEnd)}`,
      left: getDaysBetween(startDate, weekStart.toISOString().slice(0, 10)) - 1,
      width: 5,
    });

    current = addDays(current, 7);
    weekIndex += 1;
  }

  return result;
}

function getMonths(startDate, endDate) {
  const months = [];
  let current = toDate(startDate);
  const end = toDate(endDate);

  while (current <= end) {
    const month = current.toLocaleDateString("ru-RU", { month: "long" });
    const normalizedMonth = month[0].toUpperCase() + month.slice(1);

    const monthStart = new Date(current);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    const visibleEnd = monthEnd > end ? end : monthEnd;

    months.push({
      name: normalizedMonth,
      left:
        getDaysBetween(startDate, monthStart.toISOString().slice(0, 10)) - 1,
      width: getDaysBetween(
        monthStart.toISOString().slice(0, 10),
        visibleEnd.toISOString().slice(0, 10),
      ),
    });

    current = addDays(visibleEnd, 1);
  }

  return months;
}

function getCardColor(item, isExpanded) {
  const overdue = isOverdue(item);

  if (overdue && isExpanded) return "bg-[#FFF4CF]";
  if (overdue && !isExpanded) return "bg-[#FFF0C2]";
  if (!overdue && isExpanded) return "bg-[#FFD35C]";

  return "bg-[#FFE08A]";
}

function formatFullDate(value) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU");
}

function RoadmapItem({ item, calendar, color, isExpanded, onToggle }) {
  const { left, width } = getTaskPosition(
    item.startDate,
    item.endDate,
    calendar,
  );

  const cardColor = getTaskCardColor(item, isExpanded, color);

  const assigneeInitials = `${item.assignee?.surname?.[0] ?? ""}${
    item.assignee?.name?.[0] ?? ""
  }`;

  const cardWidth = isExpanded ? Math.max(width, 560) : Math.max(width, 210);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "absolute top-6 rounded-md p-3 text-left text-[16px] transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg",
        cardColor,
        isExpanded
          ? "z-50 -translate-y-5 shadow-2xl ring-1 ring-black/5"
          : "z-10 shadow-md",
      ].join(" ")}
      style={{
        left,
        width: cardWidth,
      }}
    >
      {isExpanded ? (
        <div className="grid grid-cols-[1fr_240px] gap-8">
          <div>
            <div className="line-clamp-1 text-[16px] font-medium">
              {item.title}
            </div>

            <div className="mt-1 text-[16px]">
              Статус: {statusLabel[item.status] ?? "Не указан"}
            </div>

            <div className="text-[16px]">
              Приоритет: {priorityLabel[item.priority] ?? "Не указан"}
            </div>

            {item.jiraLink && (
              <a
                href={item.jiraLink}
                target="_blank"
                rel="noreferrer"
                onClick={(evt) => evt.stopPropagation()}
                className="mt-7 inline-flex rounded border border-[#C3C0C0] bg-[#DCDCDC] px-3 py-1 text-[16px] text-black hover:bg-[#C3C0C0]"
              >
                Jira
              </a>
            )}
          </div>

          <div>
            <div className="text-[16px]">
              Дата создания: {formatFullDate(item.startDate)}
            </div>

            <div className="text-[16px]">
              Дедлайн: {formatFullDate(item.endDate)}
            </div>

            {item.completedAt && (
              <div className="text-[16px]">
                Дата выполнения: {formatFullDate(item.completedAt)}
              </div>
            )}

            <div className="mt-4 flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-black bg-[#FCD9D9] text-[16px] text-[#FF0404]">
                {assigneeInitials}
              </div>

              <div className="whitespace-nowrap text-[16px] font-medium">
                {item.assignee?.name} {item.assignee?.surname}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative pr-10">
          <div className="line-clamp-1 text-[16px] font-medium">
            {item.title}
          </div>

          <div className="mt-1 text-[16px]">
            Статус: {statusLabel[item.status] ?? "Не указан"}
          </div>

          <div className="line-clamp-1 text-[16px]">
            Приоритет: {priorityLabel[item.priority] ?? "Не указан"}
          </div>

          <div className="absolute right-0 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-[#FCD9D9] text-[12px] text-[#FF0404]">
            {assigneeInitials}
          </div>
        </div>
      )}
    </button>
  );
}

export function RoadmapBoard({ data }) {
  const scrollRef = useRef(null);
  const [expandedItemId, setExpandedItemId] = useState(null);

  const roadmapStartDate = data?.startDate;

  const calendar = useMemo(() => {
    const year = roadmapStartDate
      ? new Date(`${roadmapStartDate}T00:00:00`).getFullYear()
      : new Date().getFullYear();

    return getYearCalendar(year);
  }, [roadmapStartDate]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const today = new Date();

    const currentDayOffset =
      differenceInCalendarDays(today, new Date(calendar.startDate)) * DAY_WIDTH;

    const leftOffset = Math.max(currentDayOffset - DAY_WIDTH * 14, 0);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        left: leftOffset,
        behavior: "auto",
      });
    });
  }, [calendar.startDate, data?.lanes?.length]);

  if (!data) return null;

  const daysCount = getDaysBetween(calendar.startDate, calendar.endDate);
  const timelineWidth = calendar.months.reduce((total, month, index) => {
    return total + getMonthWidth(month) + (index === 0 ? 0 : MONTH_GAP);
  }, 0);

  const scrollByWeek = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * WEEK_SCROLL_WIDTH,
      behavior: "smooth",
    });
  };

  const isEmptyRoadmap = data.lanes.length === 0;

  return (
    <div
      className="grid overflow-hidden bg-[#FAFAFA] rounded-[3px]"
      style={{
        width: BOARD_WIDTH,
        maxWidth: "100%",
        height: BOARD_HEIGHT,
        gridTemplateColumns: isEmptyRoadmap
        ? "1fr"
        : `${SIDEBAR_WIDTH}px 1fr`,
      }}
    >
      {/* левая колонка НЕ скроллится горизонтально */}
      {!isEmptyRoadmap && (
      <div className="relative z-40 bg-[#FAFAFA]">
        {data.lanes.length === 0
          ? null
          : data.lanes.map((lane, laneIndex) => {
              const color = getRoadmapColor(laneIndex);

              return (
                <div
                  key={lane.id}
                  className="absolute left-0 pr-4"
                  style={{
                    top: BOARD_BODY_TOP + laneIndex * ROW_HEIGHT,
                    width: SIDEBAR_WIDTH,
                  }}
                >
                  <div
                    className={`rounded-md p-4 text-[14px] leading-[20px] shadow-md ${color.lane}`}
                    style={{
                      width: 210,
                      maxWidth: 210,
                      minHeight: 74,
                      maxHeight: 120,
                      overflow: "hidden",
                    }}
                    title={lane.title}
                  >
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {lane.title}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      )}

      {/* правая часть — календарь + задачи */}
      <div className="relative overflow-hidden bg-[#FAFAFA]">
        {/* стрелки по бокам от шапки, на уровне недель */}
        <button
          type="button"
          onClick={() => scrollByWeek(-1)}
          className="absolute left-0 top-10 z-40 flex size-8 items-center justify-center rounded-full border bg-[#EDEDED] text-sm shadow"
        >
          <img src={vectorImage} alt="<" />
        </button>

        <button
          type="button"
          onClick={() => scrollByWeek(1)}
          className="absolute right-0 top-10 z-40 flex size-8 items-center justify-center rounded-full border bg-[#EDEDED] text-sm shadow"
        >
          <img src={vectorImage} alt=">" className="rotate-180" />
        </button>

        <div
          ref={scrollRef}
          className="hide-scrollbar h-full overflow-x-auto overflow-y-hidden"
        >
          <div
            className="relative  bottom-5"
            style={{
              width: timelineWidth,
              minHeight: BOARD_HEIGHT,
            }}
          >
            {/* шапка */}
            <div
              className="sticky top-0 z-30"
              style={{ height: HEADER_HEIGHT }}
            >
              <div className="absolute left-0 top-0 bottom-8">
                {calendar.months.map((month) => (
                  <div
                    key={month.id}
                    className="absolute h-8 rounded-[3px] bg-[#999999] text-center text-2xl font-semibold text-white"
                    style={{
                      left: getMonthLeft(month, calendar.months),
                      width: getMonthWidth(month),
                    }}
                  >
                    {month.title}
                  </div>
                ))}
              </div>

              <div className="absolute left-0 top-8 ">
                {calendar.weeks.map((week) => (
                  <div
                    key={week.id}
                    className="absolute rounded-[3px] bg-[#DCDCDC] text-center"
                    style={{
                      left: getWeekLeft(week, calendar.months),
                      width: WEEK_WIDTH,
                      height: WEEK_HEIGHT,
                    }}
                  >
                    <div className="text-[20px] font-semibold leading-[24px]">
                      {week.title}
                    </div>

                    <div className="text-[16px] font-semibold leading-[20px]">
                      {week.dates}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* сетка */}
            <div
              className="absolute left-0 bottom-0"
              style={{
                top: HEADER_HEIGHT,
                width: timelineWidth,
              }}
            >
              {calendar.weeks.map((week) => {
                const dayWidth = WEEK_WIDTH / 7;

                return (
                  <div
                    key={week.id}
                    className="absolute top-0 bottom-0 bg-[#F3F3F3]"
                    style={{
                      left: getWeekLeft(week, calendar.months),
                      width: WEEK_WIDTH,
                      backgroundImage: `
            repeating-linear-gradient(
              to right,
              transparent 0,
              transparent ${dayWidth - 1}px,
              rgba(255,255,255,0.95) ${dayWidth - 1}px,
              rgba(255,255,255,0.95) ${dayWidth + 1}px
            )
          `,
                    }}
                  />
                );
              })}
            </div>

            {data.lanes.length === 0 ? (
              <div className="absolute top-32 left-0 right-0 text-center text-sm text-slate-400">
              </div>
            ) : (
              data.lanes.map((lane, laneIndex) => {
                const color = getRoadmapColor(laneIndex);

                return (
                  <div
                    key={lane.id}
                    className="absolute left-0"
                    style={{
                      top: BOARD_BODY_TOP + laneIndex * ROW_HEIGHT,
                      width: timelineWidth,
                      height: ROW_HEIGHT,
                    }}
                  >
                    {lane.items.map((item) => (
                      <RoadmapItem
                        key={item.id}
                        item={item}
                        calendar={calendar}
                        color={color}
                        isExpanded={expandedItemId === item.id}
                        onToggle={() =>
                          setExpandedItemId((currentId) =>
                            currentId === item.id ? null : item.id,
                          )
                        }
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
