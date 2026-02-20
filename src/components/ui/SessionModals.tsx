"use client";

import { useEffect } from "react";

interface RawTurn {
  speaker: string;
  text: string;
}

export interface Session {
  session_topic: string;
  duration_minutes: number;
  transcript: RawTurn[];
}

interface MetricCategory {
  score: 1 | 2 | 3;
  justification: string;
}

export interface LLMEvaluation {
  session_summary: string;
  metrics: {
    content_coverage: MetricCategory;
    facilitation_quality: MetricCategory;
    protocol_safety: MetricCategory;
  };
  risk_assessment: {
    flag: "SAFE" | "RISK";
    quote: string | null;
  };
}


function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ border: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0"
          style={{ borderLeft: "4px solid #B4F000" }}
        >
          <div>
            <h2 className="text-base font-extrabold" style={{ color: "#12245B" }}>{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Transcript Modal ─────────────────────────────────────────────────────────

// Assign a stable color to each unique non-Fellow speaker
const MEMBER_COLORS = [
  { bg: "bg-blue-50",   text: "text-blue-800",   dot: "bg-blue-400"   },
  { bg: "bg-purple-50", text: "text-purple-800",  dot: "bg-purple-400" },
  { bg: "bg-orange-50", text: "text-orange-800",  dot: "bg-orange-400" },
  { bg: "bg-teal-50",   text: "text-teal-800",    dot: "bg-teal-400"   },
  { bg: "bg-pink-50",   text: "text-pink-800",    dot: "bg-pink-400"   },
  { bg: "bg-cyan-50",   text: "text-cyan-800",    dot: "bg-cyan-400"   },
];

export function TranscriptModal({
  open,
  onClose,
  session,
}: {
  open: boolean;
  onClose: () => void;
  session: Session;
}) {
  // Build speaker → color map
  const speakers = Array.from(
    new Set(session.transcript.map((t) => t.speaker).filter((s) => s !== "Fellow"))
  );
  const colorMap: Record<string, (typeof MEMBER_COLORS)[number]> = {};
  speakers.forEach((s, i) => {
    colorMap[s] = MEMBER_COLORS[i % MEMBER_COLORS.length];
  });

  const isFellow = (speaker: string) => speaker === "Fellow";

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Session Transcript"
      subtitle={`${session.session_topic} · ${session.duration_minutes} min · ${session.transcript.length} turns`}
    >
      <div className="flex flex-col gap-3">
        {session.transcript.map((turn, i) => {
          const fellow = isFellow(turn.speaker);
          const color = fellow ? null : colorMap[turn.speaker];

          return (
            <div key={i} className={`flex gap-3 ${fellow ? "" : "flex-row-reverse"}`}>
              {/* Avatar */}
              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold mt-0.5 ${
                  !fellow && color ? `${color.bg} ${color.text}` : ""
                }`}
                style={
                  fellow
                    ? { backgroundColor: "#12245B", color: "#B4F000" }
                    : undefined
                }
              >
                {fellow ? "F" : turn.speaker.replace("Member", "M")}
              </div>

              {/* Bubble */}
              <div className={`max-w-[78%] ${fellow ? "" : "items-end"} flex flex-col gap-0.5`}>
                <span className="text-[10px] font-semibold text-gray-400 px-1">
                  {turn.speaker}
                </span>
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={
                    fellow
                      ? { backgroundColor: "#12245B", color: "#fff", borderBottomLeftRadius: "4px" }
                      : { backgroundColor: "#F3F4F6", color: "#1f2937", borderBottomRightRadius: "4px" }
                  }
                >
                  {turn.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}

// ─── LLM Evaluation Modal ─────────────────────────────────────────────────────

const SCORE_META: Record<number, { label: string; color: string }> = {
  1: { label: "Poor",      color: "#ef4444" },
  2: { label: "Partial",   color: "#f59e0b" },
  3: { label: "Excellent", color: "#B4F000" },
};

function ScorePips({ score }: { score: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-1.5 w-8 rounded-full"
          style={{ backgroundColor: i <= score ? SCORE_META[score].color : "#e5e7eb" }}
        />
      ))}
    </div>
  );
}

export function LLMEvaluationModal({
  open,
  onClose,
  evaluation,
}: {
  open: boolean;
  onClose: () => void;
  evaluation: LLMEvaluation;
  }) {
  if (!evaluation) return null;
  const { session_summary, metrics, risk_assessment } = evaluation;

  const metricRows: { key: keyof typeof metrics; label: string }[] = [
    { key: "content_coverage",    label: "Content Coverage"     },
    { key: "facilitation_quality", label: "Facilitation Quality" },
    { key: "protocol_safety",     label: "Protocol Safety"      },
  ];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="AI Evaluation Report"
      subtitle="Generated by the Shamiri evaluation pipeline"
    >
      <div className="flex flex-col gap-5">

        {/* Risk flag */}
        {risk_assessment.flag === "RISK" ? (
          <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-500 bg-red-50">
            <span className="relative flex h-3 w-3 mt-0.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-red-700">⚠ RISK — Flagged for Immediate Review</p>
              {risk_assessment.quote && (
                <p className="text-xs text-red-600 mt-1 italic">"{risk_assessment.quote}"</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm font-bold text-green-800">SAFE — No Risk Indicators Detected</p>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Session Summary</p>
          <p className="text-sm text-gray-700 leading-relaxed">{session_summary}</p>
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Quality Metrics</p>
          {metricRows.map(({ key, label }) => {
            const m = metrics[key];
            const meta = SCORE_META[m.score];
            return (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-xl p-4"
                style={{ borderLeft: "4px solid #B4F000" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: meta.color, color: meta.color === "#B4F000" ? "#12245B" : "#fff" }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-2xl font-extrabold" style={{ color: "#12245B" }}>{m.score}</span>
                    <span className="text-xs text-gray-400">/ 3</span>
                  </div>
                </div>
                <ScorePips score={m.score} />
                <p className="text-xs text-gray-600 leading-relaxed mt-2">{m.justification}</p>
              </div>
            );
          })}
        </div>

      </div>
    </ModalShell>
  );
}
