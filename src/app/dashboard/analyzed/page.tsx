"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { analyzedService } from "../../../services/client/analyzed.service";
import { BooleanStatusBadge, ReviewStatusBadge, ScoreBadge } from "@/components/ui/StatusBadge";
import { MinimalAnalysis } from "@/types/groupSessionAnalysis.types";
import { MinimalAnalysisFilters } from "@/types/analysisFilters.types";
import { ReviewStatus } from "@/types/globalTypes.types";
import CreateGroupSessionButton from "@/components/ui/groupSessions/CreateGroupSessionButton";
import { ShamiriLoader, AiEvaluationLoader } from "@/components/Loader";
import { SessionFilters, ProcessedFilter, SafetyFilter } from "@/components/ui/analyzed/Filters";

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
  const [processedFilter,    setProcessedFilter]    = useState<ProcessedFilter>("all");
  const [safetyFilter,       setSafetyFilter]        = useState<SafetyFilter>("all");
  const [reviewStatusFilter, setReviewStatusFilter]  = useState<ReviewStatus | "all">("all");

  const booleanFilters: (keyof MinimalAnalysisFilters)[] = ["is_processed", "is_safe"];
  const reviewFilters: ReviewStatus[] = ["unreviewed", "accepted", "rejected"];

  const router = useRouter();

  const tableHeaders = ["Date","GroupId","Fellow","Is Processed","Safety Status","Review Status","Content","Facilitaion","Safety","Actions"]

  const buildFilters = (): MinimalAnalysisFilters => ({
    is_processed: processedFilter === "processed" ? true
                : processedFilter === "unprocessed" ? false
                : null,
    is_safe:      safetyFilter === "safe" ? true
                : safetyFilter === "risk" ? false
                : null,
    review_status: reviewStatusFilter !== "all" ? reviewStatusFilter : null,
  });

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
      router.push(`/dashboard/analyzed/${id}`);
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
      toast.error(`Json format is invalid`)
    } finally {
      setAiLoading(false);
    }
  }

  const trashSession = async function (id: number) {
    try {
      setLoading(true);
      const result = await analyzedService.trashSessionClient(id);
      if (!result.message) throw new Error(`Session anlaysis failed`)
      getAllSessions(currentPage, itemlimit);
      toast.success(result.message)

    } catch (error) {
      toast.error(`Error in trashing session`)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllSessions(currentPage, itemlimit);
  }, [currentPage, itemlimit, processedFilter, safetyFilter, reviewStatusFilter]);

  if (loading) return <ShamiriLoader />;
  if (aiLoading) return <AiEvaluationLoader />;

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
      <SessionFilters
        processedFilter={processedFilter}       setProcessedFilter={setProcessedFilter}
        safetyFilter={safetyFilter}             setSafetyFilter={setSafetyFilter}
        reviewStatusFilter={reviewStatusFilter} setReviewStatusFilter={setReviewStatusFilter}
        onCreated={() => getAllSessions(1, itemlimit)}
      />

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
                      {session.is_processed ? (
                        <span className="px-3 py-1.5 rounded-md bg-green-100 text-green-700 text-xs font-semibold">
                          Evaluated
                        </span>
                      ) : (
                        <button
                          onClick={() => evaluateSessionLLM(session.session_id)}
                          className="px-3 py-1.5 rounded-md bg-[#12245B] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          Evaluate
                        </button>
                      )}


                      {/* View button — ghost */}
                      <button
                        onClick={() => viewSession(session.session_id)}
                        className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:border-[#12245B] hover:text-[#12245B] transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      {/* Delete button — danger red */}
                      <button
                        onClick={() => trashSession(session.session_id)}
                        className="px-2.5 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

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
