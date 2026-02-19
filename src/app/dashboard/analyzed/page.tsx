"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { analyzedService } from "../../../services/client/analyzed.service";
import { BooleanStatusBadge, ReviewStatusBadge, ScoreBadge } from "@/components/ui/StatusBadge";
import { MinimalAnalysis } from "@/types/groupSessionAnalysis.types";
import { MinimalAnalysisFilters } from "@/types/analysisFilters.types";
import { ReviewStatus } from "@/types/globalTypes.types";
import CreateGroupSessionButton from "@/components/ui/groupSessions/CreateGroupSessionButton";

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
  const [aiLoading, setAiLoading] = useState(false);
  const [sessions, setSessions] = useState<MinimalAnalysis[]>([initialState]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemlimit, setItemlimit] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<keyof MinimalAnalysisFilters | "all">("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<ReviewStatus | "all">("all");

  const booleanFilters: (keyof MinimalAnalysisFilters)[] = ["is_processed", "is_safe"];
  const reviewFilters: ReviewStatus[] = ["unreviewed", "accepted", "rejected"];

  const tableHeaders = ["Date","GroupId","Fellow","Is Processed","Safety Status","Review Status","Content","Facilitaion","Safety","Actions"]

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

  const viewSession = async function viewSession(id:number) {
    try {
      toast.success("Successfully viewed session")
    } catch(error) {
      console.error(`Error in viewing session`, error)
    }
  }

  const evaluateSessionLLM = async function (id: number) {
    try {

      setAiLoading(true);
      const result = await analyzedService.evaluateSessionClient(id);
      if (!result.data) throw new Error(`Session anlaysis failed`)

      getAllSessions(currentPage, itemlimit);

      toast.success(result.message)
    } catch (error:any) {
      console.error(`Error in evaluating session`, error);
      toast.error(`${error.message}`)
    } finally {
      setAiLoading(false);
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

  if (aiLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16">

        {/* Animated orb cluster */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer pulse ring */}
          <div className="absolute w-20 h-20 rounded-full bg-[#12245B] opacity-10 animate-ping" />
          {/* Mid ring */}
          <div className="absolute w-14 h-14 rounded-full bg-[#12245B] opacity-20 animate-pulse" />
          {/* Core */}
          <div className="w-10 h-10 rounded-full bg-[#12245B] flex items-center justify-center shadow-lg">
            {/* Gemini star icon (two triangles) */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#B4F000] animate-spin [animation-duration:3s]">
              <path d="M12 2C12 2 14.5 9.5 22 12C14.5 14.5 12 22 12 22C12 22 9.5 14.5 2 12C9.5 9.5 12 2 12 2Z" />
            </svg>
          </div>
        </div>

        {/* Bouncing dots */}
        <div className="flex items-end gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-[#12245B] animate-bounce"
              style={{
                height: i === 0 || i === 3 ? 8 : i === 1 || i === 2 ? 12 : 8,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Shimmer text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-[#12245B] tracking-wide">
            Gemini is thinking
          </p>
          <p className="text-xs text-gray-400">Analyzing session data...</p>
        </div>

        {/* Shimmer bar */}
        <div className="w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-[#B4F000] animate-[shimmer_1.5s_ease-in-out_infinite]"
            style={{
              animation: "shimmer 1.5s ease-in-out infinite",
              background: "linear-gradient(90deg, #12245B 0%, #B4F000 50%, #12245B 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

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
        <CreateGroupSessionButton onCreated={() => getAllSessions(1, itemlimit)} />

        {/* Divider */}
        <div className="w-px self-stretch bg-gray-200" />

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
                  <td className="p-3">
                    <div className="flex items-center gap-2">

                      {/* Evaluate button — primary navy */}
                      <button
                        onClick={() => evaluateSessionLLM(session.session_id)}
                        className="px-3 py-1.5 rounded-md bg-[#12245B] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Evaluate
                      </button>

                      {/* View button — ghost */}
                      <button
                        onClick={() => toast("View session coming soon")}
                        className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:border-[#12245B] hover:text-[#12245B] transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      {/* Delete button — danger red */}
                      {/*<button
                        onClick={() => toast("Delete coming soon")}
                        className="px-2.5 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>*/}

                    </div>
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
