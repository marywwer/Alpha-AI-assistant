export function ChartCard({ title, subtitle, children }) {
  return (
    <div className="border border-[#C3C0C0] shadow-[0px_3.14px_3.14px_0px_#00000040] rounded-xl overflow-hidden w-full h-full p-3">
      <h3 className="mb-2 text-[22px] font-semibold">{title}</h3>
      <p className="mb-7 text-[16px] text-[#666666]">{subtitle}</p>
      {children}
    </div>
  );
}
