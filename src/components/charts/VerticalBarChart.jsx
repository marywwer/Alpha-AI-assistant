import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { ChartCard } from "./ChartCard.jsx";

export function VerticalBarChart({
  title,
  subtitle,
  data = [],
  xKey = "name",
  yKey = "value",
  fillColor = "#F0E5FC",
  activeColor = "#962DFF",
  isPercent = false,
}) {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleBarMouseEnter = (barData) => {
    setTooltipData(barData);
    setTooltipPosition({
      x: barData.x + barData.width / 2,
      y: barData.y,
    });
  };

  const handleBarMouseLeave = () => {
    setTooltipData(null);
  };

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div className="relative">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart 
            data={data}
            margin={{ left: 15 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E5E5EF"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-55}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 14, fill: "#000000" }}
            />
      
            {isPercent ? (
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tickLine={false}
                width={30}
                tickMargin={0}
              />
            ) : (
              <YAxis
                axisLine={false}
                tickLine={false}
                width={30}
                tickMargin={0}
              />
            )}
            
            <Tooltip cursor={false} content={<></>} />
            <Bar
              dataKey={yKey}
              barSize={49}
              radius={12}
              fill={fillColor}
              activeBar={{ fill: activeColor }}
              onMouseEnter={handleBarMouseEnter}
              onMouseLeave={handleBarMouseLeave}
            />
          </BarChart>
        </ResponsiveContainer>

        {tooltipData && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: "translate(-50%, calc(-100% - 10px))",
            }}
          >
            <div className="relative rounded-[6px] bg-[#B9B9B9] px-3 py-2 text-center text-[14px] text-white whitespace-nowrap">
              {tooltipData.value}
              <div className="absolute left-1/2 top-full -translate-x-1/2">
                <div className="border-x-[6px] border-t-[6px] border-x-transparent border-t-[#B9B9B9]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
