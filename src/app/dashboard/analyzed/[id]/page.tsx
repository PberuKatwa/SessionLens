"use client";

import { ReviewStatus } from "@/types/globalTypes.types";
import { GroupSessionAnalysis } from "@/types/groupSessionAnalysis.types";
import { useState, useEffect } from "react";
import { ScoreBar, ScoreLabel, SectionHeader, MetaCell, ScoreDescription } from "@/components/ui/analyzed/ScoreComponents";
import { useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

const SESSION_DATA: GroupSessionAnalysis = {
  session_id: 2847,
  user_id: 509,
  group_id: 114,
  fellow_name: "Amara Wanjiku",
  is_processed: true,
  transcript: { raw: "session-transcript-2847.txt" },
  session_created_at: new Date("2025-02-14T10:00:00"),

  analyzed_id: 7713,
  is_safe: true,
  review_status: "unreviewed",
  content_coverage: 2,
  facilitation_quality: 3,
  protocol_safety: 3,
  summary:
    "Fellow Amara Wanjiku led a Growth Mindset group session with six participants in Nairobi's Kibera community, demonstrating strong facilitation skills and genuine warmth throughout the hour. The session covered core growth mindset concepts including the power of \"yet\" and reframing challenges, though practical application exercises were abbreviated due to time constraints. No safety concerns were identified and the Fellow remained fully within Shamiri's curriculum boundaries throughout the session.",
  reviewer_id: 42,
  reviewer_comments:
    "AI assessment aligns with my observations. Recommend a coaching note on deepening practice activities.",
  llm_evaluation: { model: "claude-3-5-sonnet", version: "2025-02-01", tokens: 4821 },
  analysis_created_at: new Date("2025-02-14T11:23:00"),
};

// ─── Toast ─────────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({
    msg: "",
    visible: false,
  });
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const show = (msg: string) => {
    if (timer) clearTimeout(timer);
    setToast({ msg, visible: true });
    const t = setTimeout(() => setToast((p) => ({ ...p, visible: false })), 2800);
    setTimer(t);
  };

  useEffect(() => () => { if (timer) clearTimeout(timer); }, [timer]);

  return { toast, show };
}

function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      style={{ backgroundColor: "#12245B", color: "#fff" }}
    >
      <span style={{ color: "#B4F000" }} className="text-base">✦</span>
      <span>{msg}</span>
    </div>
  );
}

export default function EvaluationPage() {

  const params = useParams();
  const id = params.id;




  const { toast, show } = useToast();
  const s = SESSION_DATA;

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const reviewBadge: Record<ReviewStatus, { bg: string; dot: string; label: string }> = {
    unreviewed:  { bg: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400", label: "Pending Review" },
    accepted: { bg: "bg-green-100 text-green-800",  dot: "bg-green-500",  label: "Approved" },
    rejected: { bg: "bg-red-100 text-red-700",      dot: "bg-red-500",    label: "Rejected" },
  };

  const rb = reviewBadge[s.review_status ?? "unreviewed"];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Toast msg={toast.msg} visible={toast.visible} />

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: "#12245B", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-extrabold text-xl tracking-tight">shamiri</span>
            <span className="w-px h-5 bg-white/20" />
            <span className="text-white/50 text-sm font-medium">Supervisor Intelligence</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#B4F000" }} />
            Session #{s.session_id}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Page Title ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Evaluation View</p>
          <h1 className="text-3xl font-extrabold" style={{ color: "#12245B" }}>Session Review</h1>
        </div>

        {/* ── Action Bar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {/* Evaluate */}
          <button
            onClick={() => show("Session sent for AI evaluation")}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all hover:brightness-105"
            style={{ backgroundColor: "#B4F000", color: "#12245B" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
            </svg>
            Evaluate Session
          </button>

          {/* Review */}
          <button
            onClick={() => show("Session marked for human review")}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border-2 transition-colors hover:text-white"
            style={{ borderColor: "#12245B", color: "#12245B" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#12245B"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#12245B"; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Review Session
          </button>

          {/* Trash */}
          <button
            onClick={() => show("Session moved to trash")}
            className="ml-auto flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Trash Session
          </button>
        </div>

        {/* ══════════ PART 1: GROUP SESSION ══════════ */}
        <section className="mb-8">
          <SectionHeader number="1" label="Original Group Session" />

          <div
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            style={{ borderLeft: "4px solid #B4F000" }}
          >
            {/* Row 1 */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
              <MetaCell label="Fellow">{s.fellow_name}</MetaCell>
              <MetaCell label="Session ID">#{s.session_id}</MetaCell>
              <MetaCell label="Group ID">GRP-{s.group_id}</MetaCell>
              <MetaCell label="Date">{fmt(s.session_created_at)}</MetaCell>
            </div>

            {/* Row 2 */}
            <div className="border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
              <MetaCell label="User ID">USR-{s.user_id}</MetaCell>
              <MetaCell label="Processed">
                {s.is_processed ? (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Yes</span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">No</span>
                )}
              </MetaCell>
              <div className="p-5 col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Session Transcript</p>
                <button
                  onClick={() => show("Opening original transcript…")}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border-2 transition-colors"
                  style={{ borderColor: "#12245B", color: "#12245B" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#12245B"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#12245B"; }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Show Original Transcript
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ PART 2: ANALYSIS ══════════ */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold"
              style={{ backgroundColor: "#B4F000", color: "#12245B" }}
            >
              2
            </div>
            <h2 className="text-lg font-bold" style={{ color: "#12245B" }}>AI Analysis</h2>
            <div className="flex-1 h-px bg-gray-100" />
            {s.analysis_created_at && (
              <span className="text-xs text-gray-400">Analyzed {fmt(s.analysis_created_at)}</span>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.is_safe ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.is_safe ? "bg-green-500" : "bg-red-500"}`} />
              {s.is_safe ? "SAFE — No Risk Indicators" : "RISK — Flagged for Review"}
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${rb.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${rb.dot}`} />
              Review Status: {rb.label}
            </span>

            {s.analyzed_id && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                Analysis ID: #{s.analyzed_id}
              </span>
            )}
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              { key: "content",      label: "Content Coverage",     value: s.content_coverage,     metric: "content" },
              { key: "facilitation", label: "Facilitation Quality", value: s.facilitation_quality, metric: "facilitation" },
              { key: "safety",       label: "Protocol Safety",      value: s.protocol_safety,      metric: "safety" },
            ].map(({ key, label, value, metric }) => (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-xl p-5"
                style={{ borderLeft: "4px solid #B4F000" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">{label}</p>
                <div className="flex items-end gap-3">
                  <div className="text-4xl font-extrabold" style={{ color: "#12245B" }}>{value ?? "—"}</div>
                  <div className="text-sm text-gray-400 mb-1">/ 3</div>
                  <div
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#B4F000", color: "#12245B" }}
                  >
                    {value ? ScoreLabel(metric, value) : "N/A"}
                  </div>
                </div>
                {value !== undefined && <ScoreBar score={value} />}
                <p className="text-xs text-gray-500 mt-2">{value ? ScoreDescription(metric, value) : "Not yet evaluated."}</p>
              </div>
            ))}
          </div>

          {/* Summary + Reviewer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Summary */}
            <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">AI Session Summary</p>
                <button
                  onClick={() => show("Opening LLM evaluation object…")}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition-colors"
                  style={{ borderColor: "#12245B", color: "#12245B" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#12245B"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#12245B"; }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.8 1.8M5 14.5l-1.8 1.8" />
                  </svg>
                  Show LLM Evaluation
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {s.summary ?? "No summary available."}
              </p>
            </div>

            {/* Human Review Panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Human Review</p>

              <div className="space-y-4 mb-4 flex-1">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Reviewer</p>
                  <p className="text-sm font-semibold" style={{ color: "#12245B" }}>
                    SUP-0{s.reviewer_id} — Dr. Nkosi
                  </p>
                </div>
                {s.reviewer_comments && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Comments</p>
                    <p className="text-sm text-gray-600 italic leading-snug">"{s.reviewer_comments}"</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <button
                  onClick={() => show("AI findings validated ✓")}
                  className="w-full text-xs font-bold py-2.5 rounded-lg transition-all hover:brightness-105"
                  style={{ backgroundColor: "#B4F000", color: "#12245B" }}
                >
                  Validate AI Findings
                </button>
                <button
                  onClick={() => show("AI findings rejected")}
                  className="w-full text-xs font-semibold py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400 transition-colors"
                >
                  Reject AI Findings
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
