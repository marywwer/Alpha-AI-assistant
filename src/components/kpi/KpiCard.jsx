import {
  AlertTriangle,
  Archive,
  BadgePercent,
  Bookmark,
  BookOpen,
  Box,
  Code2,
  Command,
  Clock,
  CircleCheckBig,
  FileText,
  File,
  GitCommit,
  Loader,
  LayoutGrid,
  Paperclip,
  RefreshCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Slack from "../../../public/img/slack.svg";
import Trello from "../../../public/img/trello.svg";

import { cn, formatMetricValue } from "../../shared/lib/utils.js";

const titleTooltipMap = {
  team_efficiency: "Вычисляется по формуле на основе данных всех метрик",
  avg_commit_size: "Вычисляется как сумма добавленных и удалённых строк, делённая на кол-во коммитов",
};



const iconMap = {
  created_tasks: FileText,
  reopened_tasks: Paperclip,
  overdue_tasks: AlertTriangle,
  unassigned_tasks: Loader,
  late_done_percent: LayoutGrid,
  reopened_bug_tasks: Archive,
  tasks_in_progress: Clock,
  done_tasks: CircleCheckBig,

  team_efficiency: Command,
  team_interaction_quality: Bookmark,

  commit_count: () => <img src={Slack} alt="slack" className="w-6 h-6" />,
  avg_commit_size: () => <img src={Trello} alt="trello" className="w-6 h-6" />,
  created_pages: File
};

export function KpiCard({ metric, className, ...props }) {
  const isUp = metric.trend === "up";
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const Icon = iconMap[metric.id] || FileText;
  const titleTooltip = titleTooltipMap[metric.id];

  return (
    <article
      className={cn(
        "border-b border-[#E5E5E5] py-3 last:border-b-0",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-2">
        <Icon size={24} className="mt-[2px] shrink-0 text-[#000]" />

        <div className="min-w-0 flex-1">
          {/* Заголовок с подсказкой */}
          <div className="group/title relative inline-block">
            <div className="text-[16px] font-medium leading-tight text-[#060923]">
              {metric.title}
            </div>
            
            {/* Подсказка для заголовка */}
            {titleTooltip && (
              <div className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-[260px] rounded-[6px] bg-[#B9B9B9] px-3 py-2 text-center text-[14px] leading-[18px] text-white whitespace-normal group-hover/title:block">
                {titleTooltip}
                <div className="absolute left-5 top-full h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#B9B9B9]" />
              </div>
            )}
          </div>

          <div className="mt-1 text-[18px] text-[#666666]">
            {formatMetricValue(metric.value)}
          </div>
        </div>

        <div className="group relative mt-auto flex items-center gap-1 text-[16px] text-[#50D1B2]">
          <TrendIcon size={14} />
          <span>{metric.delta}%</span>
        </div>
      </div>
    </article>
  );
}