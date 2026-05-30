import { useState } from "react";

export function KpiGroup({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-[350px] rounded-[8px] border border-[#D1D1D1] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[60px] w-full items-center justify-between px-4 text-left text-[22px] font-semibold"
      >
        <span>{title}</span>
      </button>

      {isOpen && (
        <div className="border-t border-[#E5E5E5] px-4 py-3">
          <div className="space-y-0">{children}</div>
        </div>
      )}
    </section>
  );
}
