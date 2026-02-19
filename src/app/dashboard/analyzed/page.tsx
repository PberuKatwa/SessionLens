"use client";

import { useEffect, useState } from "react";
import { analyzedService } from "../../../services/client/analyzed.service";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

type Status = "Safe" | "Flagged" | "Processed";

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; color: string }> = {
    Safe: { bg: "rgba(180,240,0,0.12)", color: "#5a7a00" },
    Flagged: { bg: "rgba(239,68,68,0.1)", color: "#DC2626" },
    Processed: { bg: "rgba(18,36,91,0.07)", color: "#12245B" },
  };

  const s = map[status];

  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {status}
    </span>
  );
}

function ScoreDot({ score }: { score?: number }) {
  if (!score) return <span style={{ color: "#9CA3AF" }}>—</span>;

  const color =
    score > 80 ? "#B4F000" :
    score > 50 ? "#FACC15" :
    "#DC2626";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
        }}
      />
      <span style={{ fontSize: 12 }}>{score}</span>
    </div>
  );
}

export default function AnalyzedSessionsPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Safe", "Flagged", "Processed"];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await analyzedService.fetchMinimalAnalysis();

        if (!res.success) throw new Error(res.message);

        setSessions(res.data?.data ?? []);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch analyzed sessions");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const mappedSessions = sessions.map((s) => {
    let status: Status = "Processed";
    if (s.is_safe === false) status = "Flagged";
    else if (s.is_safe === true) status = "Safe";

    return {
      id: s.session_id,
      fellow: s.fellow_name,
      date: s.analysis_created_at
        ? new Date(s.analysis_created_at).toLocaleDateString()
        : "—",
      topic: `Group ${s.group_id}`,
      scores: {
        content: s.content_coverage,
        facilitation: s.facilitation_quality,
        safety: s.protocol_safety,
      },
      risk: s.is_safe ? "SAFE" : "RISK",
      status,
    };
  });

  const filtered =
    filter === "All"
      ? mappedSessions
      : mappedSessions.filter((s) => s.status === filter);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#12245B" }}>
            Analyzed Sessions
          </h2>
          <span
            style={{
              background: "rgba(18,36,91,0.07)",
              padding: "2px 9px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {mappedSessions.length}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          AI-processed session transcripts with quality scores and risk detection.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              border: "1.5px solid",
              borderColor: filter === f ? "#12245B" : "#E5E7EB",
              background: filter === f ? "#12245B" : "#fff",
              color: filter === f ? "#fff" : "#6B7280",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14 }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              {["Session", "Fellow", "Date", "Topic", "Content", "Facilitation", "Safety", "Risk", "Status", "Actions"]
                .map((h) => (
                  <th key={h} style={{ padding: 12, textAlign: "left", fontSize: 11, color: "#9CA3AF" }}>
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id}>
                <td style={{ padding: 12 }}>{s.id}</td>
                <td style={{ padding: 12 }}>{s.fellow}</td>
                <td style={{ padding: 12 }}>{s.date}</td>
                <td style={{ padding: 12 }}>{s.topic}</td>
                <td style={{ padding: 12 }}><ScoreDot score={s.scores.content} /></td>
                <td style={{ padding: 12 }}><ScoreDot score={s.scores.facilitation} /></td>
                <td style={{ padding: 12 }}><ScoreDot score={s.scores.safety} /></td>
                <td style={{ padding: 12 }}>{s.risk}</td>
                <td style={{ padding: 12 }}><StatusBadge status={s.status} /></td>

                {/* Actions */}
                <td style={{ padding: 12 }}>
                  <button
                    onClick={() => toast("View session coming soon")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #E5E7EB",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
