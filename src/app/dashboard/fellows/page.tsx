"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { analyzedService } from "@/services/client/analyzed.service";
import { BooleanStatusBadge, ScoreBadge } from "@/components/ui/StatusBadge";
import { FellowInsight } from "@/types/groupSessionAnalysis.types";
import { MinimalAnalysisFilters } from "@/types/analysisFilters.types";
import { ReviewStatus } from "@/types/globalTypes.types";
import { ShamiriLoader } from "@/components/Loader";
import { SessionFilters, ProcessedFilter, SafetyFilter } from "@/components/ui/analyzed/Filters";

const initialState: FellowInsight = {
  fellow_id: 0,
  fellow_name: "",
  total_sessions: "",
  analyzed_sessions: "",
  avg_content_coverage: "",
  processed_percent: "",
  avg_facilitation_quality: "",
  risk_rate: "",
  risk_sessions: "",
  avg_protocol_safety: "",
  overall_quality: "",
};

export default function FellowInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [fellows, setFellows] = useState<FellowInsight[]>([initialState]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemlimit, setItemlimit] = useState<number>(10);
  const [processedFilter, setProcessedFilter] = useState<ProcessedFilter>("all");
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<ReviewStatus | "all">("all");

  const tableHeaders = [
    "Fellow",
    "Total Sessions",
    "Analyzed Sessions",
    "Processed %",
    "Risk Sessions",
    "Risk Rate",
    "Avg Content",
    "Avg Facilitation",
    "Avg Safety",
    "Overall Quality",
  ];

  const buildFilters = (): MinimalAnalysisFilters => ({
    is_processed:
      processedFilter === "processed" ? true
      : processedFilter === "unprocessed" ? false
      : null,
    is_safe:
      safetyFilter === "safe" ? true
      : safetyFilter === "risk" ? false
      : null,
    review_status: reviewStatusFilter !== "all" ? reviewStatusFilter : null,
  });

  const getAllFellows = async function (page: number, limit: number) {
    try {
      const filters = buildFilters();
      const response = await analyzedService.fetchFellowInsights(page, limit, filters);

      if (!response.data) throw new Error(`No fellow insights were found`);

      setFellows(response.data.data);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);

      toast.success(response.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch fellow insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFellows(currentPage, itemlimit);
  }, [currentPage, itemlimit, processedFilter, safetyFilter, reviewStatusFilter]);

  if (loading) return <ShamiriLoader />;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#12245B" }}>
            Fellow Insights
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
          Aggregated session quality metrics and risk insights per fellow.
        </p>
      </div>

      {/* Filters */}
      <SessionFilters
        processedFilter={processedFilter}       setProcessedFilter={setProcessedFilter}
        safetyFilter={safetyFilter}             setSafetyFilter={setSafetyFilter}
        reviewStatusFilter={reviewStatusFilter} setReviewStatusFilter={setReviewStatusFilter}
        onCreated={() => getAllFellows(1, itemlimit)}
      />

      {/* Table */}
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14 }}>
        <table style={{ width: "100%" }}>

          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header} style={{ padding: 12, textAlign: "left", fontSize: 11, color: "#9CA3AF" }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {fellows.map((fellow) => (
              <tr key={fellow.fellow_id}>
                <td style={{ padding: 12 }}>{fellow.fellow_name}</td>
                <td style={{ padding: 12 }}>{fellow.total_sessions}</td>
                <td style={{ padding: 12 }}>{fellow.analyzed_sessions}</td>
                <td style={{ padding: 12 }}>{fellow.processed_percent}%</td>
                <td style={{ padding: 12 }}>{fellow.risk_sessions}</td>
                <td style={{ padding: 12 }}>{fellow.risk_rate}%</td>
                <td style={{ padding: 12 }}><ScoreBadge value={Number(fellow.avg_content_coverage)} /></td>
                <td style={{ padding: 12 }}><ScoreBadge value={Number(fellow.avg_facilitation_quality)} /></td>
                <td style={{ padding: 12 }}><ScoreBadge value={Number(fellow.avg_protocol_safety)} /></td>
                <td style={{ padding: 12 }}><ScoreBadge value={Number(fellow.overall_quality)} /></td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
