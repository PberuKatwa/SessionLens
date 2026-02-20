export function ScoreLabel(metric: string, score: number): string {
  const labels: Record<string, string[]> = {
    content:      ["", "Missed", "Partial", "Complete"],
    facilitation: ["", "Poor", "Adequate", "Excellent"],
    safety:       ["", "Violation", "Minor Drift", "Adherent"],
  };
  return labels[metric]?.[score] ?? "";
}

export function ScoreBar({ score, max = 3 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-1.5 mt-3">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="h-2 flex-1 rounded-full transition-all"
          style={{
            backgroundColor: i < score ? (score === max ? "#B4F000" : "#12245B") : "#e5e7eb",
          }}
        />
      ))}
    </div>
  );
}

export function SectionHeader({ number, label, isLime = false }: { number: string; label: string; isLime?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold"
        style={{
          backgroundColor: isLime ? "#B4F000" : "#12245B",
          color: isLime ? "#12245B" : "#fff",
          fontFamily: "system-ui",
        }}
      >
        {number}
      </div>
      <h2 className="text-lg font-bold" style={{ color: "#12245B" }}>{label}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

export function MetaCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
      <div className="text-sm font-semibold" style={{ color: "#12245B" }}>{children}</div>
    </div>
  );
}

export function ScoreDescription(metric: string, score: number): string {
  const desc: Record<string, string[]> = {
    content:      ["", "Core concept not taught.", "Introduced but examples limited.", "Fully taught with practical examples."],
    facilitation: ["", "Minimal engagement observed.", "Adequate warmth and questioning.", "Strong empathy and open-ended engagement."],
    safety:       ["", "Scope violation detected.", "Minor curriculum drift noted.", "No scope violations detected."],
  };
  return desc[metric]?.[score] ?? "";
}
