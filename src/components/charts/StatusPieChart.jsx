import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartCard } from "./ChartCard.jsx";

const COLORS = ["#A5C4FD", "#E3B0FF", "#FF7676"];

export function StatusPieChart({ data = [] }) {
  return (
      <ChartCard
        title="Распределение по статусам"
        subtitle="Количество задач, распределенных по статусам"
      >
        <ResponsiveContainer width="100%" height={403}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="139"
              innerRadius={81.5}
              outerRadius={139.5}
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              labelLine={false}
              labelStyle={{ fontSize: "16px", fill: "#000000" }}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
  );
}