import { KpiCard } from "../components/kpi/KpiCard.jsx";
import { KpiGroup } from "../components/kpi/KpiGroupCard.jsx";
import { StatusPieChart } from "../components/charts/StatusPieChart.jsx";
import { VerticalBarChart } from "../components/charts/VerticalBarChart.jsx";
import { HorizontalBarChart } from "../components/charts/HorizontalBarChart.jsx";
import { useAppStore } from "../store/appStore.js";
import {
  useClosedTasksByType,
  useEfficiencyByTeam,
  useKpi,
  useLateDoneByTeam,
  useMemberLoad,
  useOverdueByTeam,
  usePriorityDoneTasks,
  useStatusDistribution,
} from "../features/analytics/useAnalytics.js";
import { teams } from "../data/mockData.js";

const teamMetricGroups = [
  {
    title: "Задачи",
    ids: [
      "created_tasks",
      "reopened_tasks",
      "overdue_tasks",
      "unassigned_tasks",
      "late_done_percent",
      "reopened_bug_tasks",
      "tasks_in_progress",
      "done_tasks",
    ],
  },
  {
    title: "Команда",
    ids: ["team_efficiency", "team_interaction_quality"],
  },
  {
    title: "Коммиты и страницы",
    ids: ["commit_count", "avg_commit_size", "created_pages"],
  },
];

const allTeamsMetricGroups = [
  {
    title: "Задачи",
    ids: [
      "created_tasks",
      "reopened_tasks",
      "overdue_tasks",
      "unassigned_tasks",
      "late_done_percent",
      "reopened_bug_tasks",
      "tasks_in_progress",
      "done_tasks",
    ],
  },
  {
    title: "Коммиты и страницы",
    ids: ["commit_count", "avg_commit_size", "created_pages"],
  },
];

const STATUS_COLORS = ["#A5C4FD", "#E3B0FF", "#FF7676"];

const TASK_TYPE_COLORS = ["#FFA8A8", "#5DBC4E", "#F4BE5E"];

export function SummaryPage() {
  const { selectedTeamId } = useAppStore();

  const isAllTeams = selectedTeamId === "all";

  const teamName = teams.find((team) => team.id === selectedTeamId)?.name;

  const pageTitle = isAllTeams ? "Все команды" : `Команда ${teamName || ""}`;

  const currentMetricGroups = isAllTeams
    ? allTeamsMetricGroups
    : teamMetricGroups;

  const metricKeys = currentMetricGroups.flatMap((group) => group.ids);

  const { data: kpiData } = useKpi(selectedTeamId, metricKeys);
  const { data: statuses } = useStatusDistribution(selectedTeamId);
  const { data: overdue } = useOverdueByTeam(selectedTeamId);
  const { data: efficiency } = useEfficiencyByTeam(selectedTeamId);
  const { data: load } = useMemberLoad(selectedTeamId);

  const { data: priorityDoneTasks } = usePriorityDoneTasks(selectedTeamId);
  const { data: closedTasksByType } = useClosedTasksByType(selectedTeamId);
  const { data: lateDoneByTeam } = useLateDoneByTeam(selectedTeamId);

  const metrics = kpiData?.metrics || [];

  return (
    <div>
      <h1 className="mb-6 text-[24px] font-semibold">{pageTitle}</h1>

      <section
        className={
          isAllTeams
            ? "flex flex-wrap items-start gap-10 lg:justify-between"
            : "grid items-start gap-6 lg:grid-cols-3"
        }
      >
        {currentMetricGroups.map((group) => {
          const groupMetrics = metrics.filter((metric) =>
            group.ids.includes(metric.id),
          );

          const isCommitsGroup = group.title === "Коммиты и страницы";

          return (
            <div
              key={group.title}
              className={
                !isAllTeams && isCommitsGroup ? "justify-self-end" : ""
              }
            >
              <KpiGroup title={group.title}>
                {groupMetrics.map((metric) => (
                  <KpiCard key={metric.id} metric={metric} />
                ))}
              </KpiGroup>
            </div>
          );
        })}
      </section>
      <section className="mt-6 grid gap-x-5 gap-y-[35px] xl:grid-cols-2">
        {isAllTeams ? (
          <>
            <VerticalBarChart
              title="Количество просроченных задач"
              subtitle="Количество просроченных задач каждой команды"
              data={overdue}
              fillColor="#B7E0FF"
              activeColor="#5BB2F2"
            />
            <VerticalBarChart
              title="Количество задач, выполненных после срока"
              subtitle="Количество задач выполненных после срока каждой команды"
              data={lateDoneByTeam}
              fillColor="#FFD4ED"
              activeColor="#F57BC3"
            />
            <VerticalBarChart
              title="Эффективность каждой команды"
              data={efficiency}
              fillColor="#F0E5FC"
              activeColor="#962DFF"
              isPercent={true}
            />
            <StatusPieChart data={statuses?.chartData} colors={STATUS_COLORS} />
          </>
        ) : (
          <>
            <StatusPieChart data={statuses?.chartData} colors={STATUS_COLORS} />
            <VerticalBarChart
              title="Распределение по приоритетам"
              subtitle="Количество выполненных задач в каждом приоритете"
              data={priorityDoneTasks}
              fillColor="#F0E5FC"
              activeColor="#962DFF"
            />
            <StatusPieChart
              title="Закрытые задачи"
              subtitle="Количество закрытых задач по каждому типу"
              data={closedTasksByType?.chartData}
              colors={TASK_TYPE_COLORS}
            />
            <HorizontalBarChart
              title="Загруженность участников команды"
              subtitle="% закрепленных задач за участником от общего числа задач на команду"
              data={load}
            />
          </>
        )}
      </section>
    </div>
  );
}
