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
import { BooleanStatusBadge, ReviewStatusBadge, ScoreBadge } from "@/components/ui/StatusBadge";
import { MinimalAnalysis } from "@/types/groupSessionAnalysis.types";
import { MinimalAnalysisFilters } from "@/types/analysisFilters.types";
import { ReviewStatus } from "@/types/globalTypes.types";

const initialState: MinimalAnalysis = {
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
  const [sessions, setSessions] = useState<MinimalAnalysis[]>([initialState]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemlimit, setItemlimit] = useState<number>(5);
  const [statusFilter, setStatusFilter] = useState<keyof MinimalAnalysisFilters | "all">("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<ReviewStatus | "all">("all");

  const booleanFilters: (keyof MinimalAnalysisFilters)[] = ["is_processed", "is_safe"];
  const reviewFilters: ReviewStatus[] = ["unreviewed", "accepted", "rejected"];

  const tableHeaders = ["Date","GroupId","Fellow","Is Evaluated","Safety Status","Review Status","Content","Facilitaion","Safety","Actions"]

  const buildFilters = (): MinimalAnalysisFilters => {
    return {
      is_processed:
        statusFilter === "is_processed"
          ? true
          : null,

      is_safe:
        statusFilter === "is_safe"
          ? true
          : null,

      review_status:
        reviewStatusFilter !== "all"
          ? reviewStatusFilter
          : null,
    };
  };

  const getAllSessions = async function (page: number, limit: number) {
    try {
      const filters = buildFilters();

      const response = await analyzedService.fetchMinimalAnalysis(
        page,
        limit,
        filters
      );

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
    getAllSessions(currentPage, itemlimit);
  }, [currentPage, itemlimit, statusFilter, reviewStatusFilter]);

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
            {totalPages * itemlimit}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          AI-processed session transcripts with quality scores and risk detection.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-row flex-wrap items-end gap-6 mb-4">

        {/* Boolean filters — Radio group */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</span>
          <div className="flex flex-row gap-2">
            {["all", ...booleanFilters].map((f) => (
              <label
                key={f}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs border-[1.5px] cursor-pointer transition-colors
                  ${statusFilter === f
                    ? "bg-[#12245B] border-[#12245B] text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:border-[#12245B]"
                  }`}
              >
                <input
                  type="radio"
                  name="booleanFilter"
                  value={f}
                  checked={statusFilter === f}
                  onChange={() =>
                    setStatusFilter(f as keyof MinimalAnalysisFilters | "all")
                  }
                  className="accent-[#B4F000] w-3 h-3"
                />
                {f === "all" ? "All" : f.replace(/_/g, " ")}
              </label>
            ))}

          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-gray-200" />

        {/* Review status — Dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Review Status</span>
          <select
            value={reviewStatusFilter}
            onChange={(e) => setReviewStatusFilter(e.target.value as ReviewStatus | "all")}
            className="px-3 py-1.5 rounded-lg text-xs border-[1.5px] border-gray-200 text-gray-500 bg-white cursor-pointer
                       hover:border-[#12245B] focus:border-[#12245B] focus:outline-none transition-colors"
          >
            <option value="all">All</option>
            {reviewFilters.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14 }}>
        <table style={{ width: "100%" }}>

          <thead>
            <tr>
              { tableHeaders.map((header) => (
                  <th key={header} style={{ padding: 12, textAlign: "left", fontSize: 11, color: "#9CA3AF" }}>
                    {header}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {
              sessions.map((session, index) => (
                <tr key={session.session_id}>

                  <td style={{ padding: 12 }}>
                    {session.analysis_created_at
                    ? new Date(session.analysis_created_at).toLocaleDateString()
                    : "—"}
                  </td>

                  <td style={{ padding: 12 }}>{session.group_id}</td>
                  <td style={{ padding: 12 }}>{session.fellow_name}</td>
                  <td style={{ padding: 12 }}>
                    <BooleanStatusBadge value={session.is_processed} trueLabel="Evaluated" falseLabel="Not Evaluated"/>
                  </td>
                  <td style={{ padding: 12 }}>
                    <BooleanStatusBadge value={session.is_safe} trueLabel="SAFE" falseLabel="RISK" nullLabel="Not Evaluated"/>
                  </td>
                  <td style={{ padding: 12 }}>
                    <ReviewStatusBadge value={session.review_status}/>
                  </td>
                  <td style={{ padding: 12 }}> <ScoreBadge value={session.content_coverage} /> </td>
                  <td style={{ padding: 12 }}><ScoreBadge value={session.facilitation_quality}/></td>
                  <td style={{ padding: 12 }}><ScoreBadge value={session.protocol_safety}/></td>

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
          </tbody>
        </table>
      </div>
    </div>
  );
}
