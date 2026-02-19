"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { analyzedService } from "../../../services/client/analyzed.service";
import { RiskStatus, RiskStatusBadge } from "@/components/ui/RiskStatusBadge";
import { MinimalAnalysis } from "@/types/groupSessionAnalysis.types";

const initialAnalysis: MinimalAnalysis = {
  session_id: 0,
  group_id:0,
  fellow_name: "null",
  is_processed: false,
  analyzed_id: 0,
  is_safe: false,
  review_status: "unreviewed",
  content_coverage: 0,
  facilitation_quality: 0,
  protocol_safety: 0,
  analysis_created_at: new Date()
}

export default function AnalyzedSessionsPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[] | MinimalAnalysis[]>([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemlimit, setItemlimit] = useState<number>(5);

  const filters = ["All", "Safe", "Flagged", "Processed"];

  const getAllSessions = async function (page: number, limit: number) {
    try {
      const response = await analyzedService.fetchMinimalAnalysis(page,limit);

      if (!response.data) throw new Error(`No sessions were found`);

      setSessions(response.data.data);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);

      toast.success(response.message);

    } catch (err: any) {
      toast.error(err.message || "Failed to fetch analyzed sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllSessions(currentPage,itemlimit);
  }, [currentPage, itemlimit]);

  const mappedSessions = sessions.map((s) => {
    let status: RiskStatus = "Processed";
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
            {
              sessions.map((session, index) => (
                <tr key={session.id}>
                  <td style={{ padding: 12 }}>{session.id}</td>
                  <td style={{ padding: 12 }}>{session.fellow}</td>
                  <td style={{ padding: 12 }}>{session.date}</td>
                  <td style={{ padding: 12 }}>{session.topic}</td>
                  <td style={{ padding: 12 }}>{session.scores.content}</td>
                  <td style={{ padding: 12 }}> {session.scores.facilitation} </td>
                  <td style={{ padding: 12 }}>{session.scores.safety}</td>
                  <td style={{ padding: 12 }}>{session.risk}</td>
                  <td style={{ padding: 12 }}><RiskStatusBadge status={s.status} /></td>

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

              ))
            }

            {filtered.map(
              (s, i) => (
              <tr key={s.id}>
                <td style={{ padding: 12 }}>{s.id}</td>
                <td style={{ padding: 12 }}>{s.fellow}</td>
                <td style={{ padding: 12 }}>{s.date}</td>
                <td style={{ padding: 12 }}>{s.topic}</td>
                <td style={{ padding: 12 }}>{s.scores.content}</td>
                <td style={{ padding: 12 }}> {s.scores.facilitation} </td>
                <td style={{ padding: 12 }}>{s.scores.safety}</td>
                <td style={{ padding: 12 }}>{s.risk}</td>
                <td style={{ padding: 12 }}><RiskStatusBadge status={s.status} /></td>

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
