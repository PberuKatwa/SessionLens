export type RiskStatus = "Safe" | "Risk";

export function RiskStatusBadge({ status }: { status: RiskStatus }) {
  const statusConfig: Record<RiskStatus, string> = {
    Safe: "bg-shamiri-lime/20 text-[#5a7a00]",
    Risk: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2.5 py-0.5
        rounded-full
        text-[11px] font-semibold uppercase tracking-wider
        font-mono
        ${statusConfig[status]}
      `}
    >
      {status}
    </span>
  );
}
