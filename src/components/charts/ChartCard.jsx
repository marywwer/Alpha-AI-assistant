import { Card } from "../ui/Card.jsx";

export function ChartCard({ title, subtitle, children }) {
  return (
    <div className="min-h-96 border border-[#C3C0C0] shadow-[0px_3.14px_3.14px_0px_#00000040] rounded-xl overflow-hidden w-[635px] h-[528px]">
      <h3 className="mb-1 text-[24px] font-semibold">{title}</h3>
      <p className="mb-7 text-[16px] text-[#666666]">{subtitle}</p>
      {children}
    </div>
  );
}
