import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard.jsx";

export function VerticalBarChart({
  title,
  subtitle,
  data = [],
  xKey = "name",
  yKey = "value",
}) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fontSize: 12, fill: "#666666" }}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => {
              if (props.payload?.tasks) {
                return [`${props.payload.tasks} задачи выполнено`, ""];
              }

              return [value, ""];
            }}
          />
          <Bar dataKey={yKey} fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
