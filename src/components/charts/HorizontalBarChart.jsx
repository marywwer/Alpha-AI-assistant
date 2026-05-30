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

export function HorizontalBarChart({ data = [] }) {
  return (
    <ChartCard
      title="Загруженность каждого участника команды"
      subtitle="% закрепленных задач за участником от общего числа задач на команду"
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />

          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#666666" }}
          />

          <YAxis
            dataKey="name"
            type="category"
            width={90}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#666666" }}
          />

          <Tooltip
            formatter={(value, name, props) => {
              if (props.payload?.tasks) {
                return [`${props.payload.tasks} задачи выполнено`, ""];
              }

              return [`${value}%`, ""];
            }}
          />

          <Bar
            dataKey="value"
            fill="#2563eb"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
