export function CustomTooltip({
  active,
  payload,
  coordinate, // не используем его
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className="relative rounded-[6px] bg-[#B9B9B9] px-3 py-2 text-center text-[14px] text-white whitespace-nowrap"
      style={{
        position: "relative",
        // Важно: tooltip будет позиционироваться через wrapper
      }}
    >
      {payload[0].value}%

      <div className="absolute left-1/2 top-full -translate-x-1/2">
        <div className="border-x-[6px] border-t-[6px] border-x-transparent border-t-[#B9B9B9]" />
      </div>
    </div>
  );
}