"use client";

import { useState } from "react";
import { analyzedService } from "../../../services/client/analyzed.service";
import { ReviewerUpdatePayload } from "../../../types/analyzedSession.types";
import { ReviewStatus } from "@/types/globalTypes.types";
import { GroupSessionAnalysis } from "@/types/groupSessionAnalysis.types";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleNotch, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onReviewed?: () => void;
  session: GroupSessionAnalysis;
};

type Decision = "accepted" | "rejected" | null;

// ─── Score metadata ───────────────────────────────────────────────────────────

const SCORE_LABELS: Record<string, Record<number, { label: string; desc: string }>> = {
  content_coverage: {
    1: { label: "Missed",   desc: "Failed to mention Growth Mindset or defined it incorrectly." },
    2: { label: "Partial",  desc: "Mentioned the concept but moved on without checking understanding." },
    3: { label: "Complete", desc: "Explained clearly, gave an example, and asked for group thoughts." },
  },
  facilitation_quality: {
    1: { label: "Poor",      desc: "Dominated conversation, interrupted students, or used jargon." },
    2: { label: "Adequate",  desc: "Polite but transactional — stuck to script without deep engagement." },
    3: { label: "Excellent", desc: "Warm, encouraged quiet members, and validated feelings." },
  },
  protocol_safety: {
    1: { label: "Violation",   desc: "Gave unauthorized medical/relationship advice or went off-topic." },
    2: { label: "Minor Drift", desc: "Got distracted but eventually returned to the topic." },
    3: { label: "Adherent",    desc: "Stayed focused on Shamiri curriculum and handled distractions gracefully." },
  },
};

const METRICS: { key: keyof Pick<ReviewerUpdatePayload, "content_coverage" | "facilitation_quality" | "protocol_safety">; label: string }[] = [
  { key: "content_coverage",    label: "Content Coverage"     },
  { key: "facilitation_quality", label: "Facilitation Quality" },
  { key: "protocol_safety",     label: "Protocol Safety"      },
];

// ─── Score Picker ─────────────────────────────────────────────────────────────

function ScorePicker({
  metricKey,
  value,
  onChange,
}: {
  metricKey: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const options = SCORE_LABELS[metricKey];
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((score) => {
        const isSelected = value === score;
        const meta = options[score];
        return (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className="flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all"
            style={{
              borderColor: isSelected ? "#12245B" : "#e5e7eb",
              backgroundColor: isSelected ? "#12245B" : "#fff",
            }}
          >
            {/* Score number */}
            <div
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold mt-0.5"
              style={{
                backgroundColor: isSelected ? "#B4F000" : "#F3F4F6",
                color: "#12245B",
              }}
            >
              {score}
            </div>
            <div>
              <p
                className="text-xs font-bold"
                style={{ color: isSelected ? "#fff" : "#12245B" }}
              >
                {meta.label}
              </p>
              <p
                className="text-[11px] leading-snug mt-0.5"
                style={{ color: isSelected ? "rgba(255,255,255,0.65)" : "#9ca3af" }}
              >
                {meta.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReviewSessionModal({ isOpen, onClose, onReviewed, session }: Props) {
  const [decision, setDecision] = useState<Decision>(null);
  const [scores, setScores] = useState({
    content_coverage:    session.content_coverage    ?? 2,
    facilitation_quality: session.facilitation_quality ?? 2,
    protocol_safety:     session.protocol_safety     ?? 2,
  });
  const [isSafe, setIsSafe] = useState<boolean>(session.is_safe ?? true);
  const [comments, setComments] = useState(session.reviewer_comments ?? "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setDecision(null);
    setScores({
      content_coverage:    session.content_coverage    ?? 2,
      facilitation_quality: session.facilitation_quality ?? 2,
      protocol_safety:     session.protocol_safety     ?? 2,
    });
    setIsSafe(session.is_safe ?? true);
    setComments(session.reviewer_comments ?? "");
  };

  const handleClose = () => { reset(); onClose(); };

  const canSubmit =
    decision !== null &&
    comments.trim().length > 0 &&
    (decision === "accepted" || true); // reject requires scores which always have a value

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) return;

    const payload: ReviewerUpdatePayload = {
      id:                   session.analyzed_id ?? 0,
      is_safe:              isSafe,
      review_status:        decision as ReviewStatus,
      content_coverage:     decision === "accepted" ? (session.content_coverage ?? scores.content_coverage) : scores.content_coverage,
      facilitation_quality: decision === "accepted" ? (session.facilitation_quality ?? scores.facilitation_quality) : scores.facilitation_quality,
      protocol_safety:      decision === "accepted" ? (session.protocol_safety ?? scores.protocol_safety) : scores.protocol_safety,
      reviewer_id:          1, // set by backend — placeholder
      reviewer_comments:    comments,
    };

    try {
      setLoading(true);
      const res = await analyzedService.reviewSession(payload);
      toast.success(res.message ?? "Review submitted");
      onReviewed?.();
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ border: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0"
          style={{ borderLeft: "4px solid #B4F000" }}
        >
          <div>
            <h3 className="text-base font-extrabold" style={{ color: "#12245B" }}>
              Review Session
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Session #{session.session_id} · {session.fellow_name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-6">

            {/* Metric preamble */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Scoring Guide</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Scores range from <strong className="text-gray-700">1</strong> (poor/violation) to <strong className="text-gray-700">3</strong> (complete/excellent/adherent) across three dimensions: how well the Fellow taught the material, how engaging their delivery was, and whether they stayed within Shamiri's lay-provider boundaries.
              </p>
            </div>

            {/* ── Step 1: Decision ── */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                Your Decision
              </label>
              <div className="grid grid-cols-2 gap-3">

                {/* Accept */}
                <button
                  type="button"
                  onClick={() => setDecision("accepted")}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all"
                  style={{
                    borderColor: decision === "accepted" ? "#B4F000" : "#e5e7eb",
                    backgroundColor: decision === "accepted" ? "#B4F000" : "#fff",
                    color: decision === "accepted" ? "#12245B" : "#6b7280",
                  }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                  Accept
                </button>

                {/* Reject */}
                <button
                  type="button"
                  onClick={() => setDecision("rejected")}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all"
                  style={{
                    borderColor: decision === "rejected" ? "#ef4444" : "#e5e7eb",
                    backgroundColor: decision === "rejected" ? "#fee2e2" : "#fff",
                    color: decision === "rejected" ? "#991b1b" : "#6b7280",
                  }}
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />
                  Reject
                </button>

              </div>
            </div>

            {/* ── Accept flow: safety toggle + comments only ── */}
            {decision === "accepted" && (
              <>
                {/* Safety override */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                    Safety Assessment
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSafe(true)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                      style={{
                        borderColor: isSafe ? "#22c55e" : "#e5e7eb",
                        backgroundColor: isSafe ? "#dcfce7" : "#fff",
                        color: isSafe ? "#15803d" : "#6b7280",
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isSafe ? "#22c55e" : "#d1d5db" }} />
                      Safe
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSafe(false)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                      style={{
                        borderColor: !isSafe ? "#ef4444" : "#e5e7eb",
                        backgroundColor: !isSafe ? "#fee2e2" : "#fff",
                        color: !isSafe ? "#991b1b" : "#6b7280",
                      }}
                    >
                      <span className="relative flex h-2 w-2">
                        {!isSafe && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />}
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: !isSafe ? "#ef4444" : "#d1d5db" }} />
                      </span>
                      Risk
                    </button>
                  </div>
                </div>

                {/* AI scores summary (read-only) */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-3">Accepting AI Scores</p>
                  <div className="flex gap-4">
                    {METRICS.map(({ key, label }) => (
                      <div key={key} className="flex flex-col items-center gap-1 flex-1">
                        <span
                          className="text-2xl font-extrabold"
                          style={{ color: "#12245B" }}
                        >
                          {session[key] ?? "—"}
                        </span>
                        <span className="text-[10px] text-gray-400 text-center leading-snug">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Reject flow: full score override + safety ── */}
            {decision === "rejected" && (
              <>
                {/* Safety override */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                    Safety Assessment
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSafe(true)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                      style={{
                        borderColor: isSafe ? "#22c55e" : "#e5e7eb",
                        backgroundColor: isSafe ? "#dcfce7" : "#fff",
                        color: isSafe ? "#15803d" : "#6b7280",
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isSafe ? "#22c55e" : "#d1d5db" }} />
                      Safe
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSafe(false)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                      style={{
                        borderColor: !isSafe ? "#ef4444" : "#e5e7eb",
                        backgroundColor: !isSafe ? "#fee2e2" : "#fff",
                        color: !isSafe ? "#991b1b" : "#6b7280",
                      }}
                    >
                      <span className="relative flex h-2 w-2">
                        {!isSafe && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />}
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: !isSafe ? "#ef4444" : "#d1d5db" }} />
                      </span>
                      Risk
                    </button>
                  </div>
                </div>

                {/* Score overrides */}
                {METRICS.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                      {label}
                    </label>
                    <ScorePicker
                      metricKey={key}
                      value={scores[key]}
                      onChange={(v) => setScores(prev => ({ ...prev, [key]: v }))}
                    />
                  </div>
                ))}
              </>
            )}

            {/* Comments — always shown once a decision is made */}
            {decision !== null && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#12245B" }}>
                  Reviewer Comments <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    decision === "accepted"
                      ? "Add any notes to accompany your acceptance…"
                      : "Explain why you are overriding the AI findings…"
                  }
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none resize-none transition-all"
                  style={{ color: "#12245B" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#12245B")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                />
              </div>
            )}

            {/* Submit */}
            {decision !== null && (
              <button
                type="submit"
                disabled={loading || !comments.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                style={{
                  backgroundColor: decision === "accepted" ? "#B4F000" : "#12245B",
                  color: decision === "accepted" ? "#12245B" : "#fff",
                }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} spin className="w-4 h-4" />
                    Submitting…
                  </>
                ) : decision === "accepted" ? (
                  "Submit Acceptance"
                ) : (
                  "Submit Rejection"
                )}
              </button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
