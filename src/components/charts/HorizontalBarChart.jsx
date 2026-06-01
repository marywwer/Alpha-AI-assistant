import { useState } from "react";
import {
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard.jsx";

const getTaskWord = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "задач";
  if (lastDigit === 1) return "задача";
  if (lastDigit >= 2 && lastDigit <= 4) return "задачи";

  return "задач";
};

function CustomHorizontalBar(props) {
  const { x, y, width, height, value, payload, index, background, onClick } =
    props;

  const fullWidth = background?.width || width;
  const percentWidth = fullWidth * (value / 100);

  return (
    <g
      className="cursor-pointer"
      onClick={() =>
        onClick({
          ...payload,
          index,
          x,
          y,
          width: percentWidth,
          height,
        })
      }
    >
      <rect
        x={x}
        y={y}
        width={fullWidth}
        height={height}
        fill="#82B57214"
        rx={6}
        ry={6}
      />

      <rect
        x={x}
        y={y}
        width={percentWidth}
        height={height}
        fill="#82B572"
        rx={6}
        ry={6}
      />

      <text
        x={x + percentWidth + 8}
        y={y + height / 2}
        dominantBaseline="middle"
        fill="#333333"
        fontSize="12"
      >
        {value}%
      </text>
    </g>
  );
}

export function HorizontalBarChart({ data = [] }) {
  const [activeBar, setActiveBar] = useState(null);

  const handleBarClick = (barData) => {
    setActiveBar((prev) => (prev?.index === barData.index ? null : barData));
  };

  return (
    <ChartCard
      title="Загруженность каждого участника команды"
      subtitle="Закрепленные задачи за участником"
    >
      <div className="relative">
        <div className="absolute left-[80px] right-[70px] top-[34px] bottom-[10px] pointer-events-none z-0">
          {Array.from({ length: data.length + 1 }).map((_, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 border-t border-dashed border-[#C9CFD8]"
              style={{
                top: `${(index / data.length) * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 34, right: 15, left: -10, bottom: 10 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />

              <YAxis
                dataKey="name"
                type="category"
                width={80}
                tickLine={false}
                axisLine={{ stroke: "#B8C0CC" }}
                tick={{
                  fontSize: 12,
                  fill: "#828898",
                }}
              />

              <Tooltip cursor={false} content={<></>} />

              <Bar
                dataKey="value"
                barSize={32}
                background={{ fill: "transparent" }}
                shape={<CustomHorizontalBar onClick={handleBarClick} />}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {activeBar && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: activeBar.x + activeBar.width * 0.72,
              top: activeBar.y + activeBar.height / 2,
              transform: "translate(-50%, -130%)",
            }}
          >
            <div className="relative rounded-[6px] bg-[#B9B9B9] px-3 py-2 text-[16px] text-white whitespace-nowrap">
              {activeBar.tasks} {getTaskWord(activeBar.tasks)} выполнено
              <div className="absolute left-1/2 top-full -translate-x-1/2">
                <div className="border-x-[14px] border-t-[9px] border-x-transparent border-t-[#B9B9B9]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
