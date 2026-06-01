import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartCard } from "./ChartCard.jsx";

const COLORS = ["#A5C4FD", "#E3B0FF", "#FF7676"];

const renderLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percentage,
}) => {
  const RADIAN = Math.PI / 180;

  const radius = outerRadius + 30; // расстояние от диаграммы

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      fontSize={14}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name} (${percentage}%)`}
    </text>
  );
};

export function StatusPieChart({
  data = [],
  title = "Распределение по статусам",
  subtitle = "Количество задач, распределенных по статусам",
  colors = ["#A5C4FD", "#E3B0FF", "#FF7676"],
}) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={81.5}
            outerRadius={139.5}
            cornerRadius={8}
            paddingAngle={2}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}