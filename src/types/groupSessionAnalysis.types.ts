import { ApiResponse } from "./api.types";

export interface GroupSessionAnalysis {
  session_id: number;

  // Group Session
  user_id: number;
  group_id: number;
  fellow_name: string;
  is_processed: boolean;
  transcript: object;
  session_created_at: Date;

  // Analysis
  analyzed_id?: number;
  is_safe?: boolean;
  review_status?: "unreviewed" | "approved" | "rejected";
  content_coverage?: number;
  facilitation_quality?: number;
  protocol_safety?: number;
  summary?: string;
  reviewer_id?: number;
  reviewer_comments?: string;
  llm_evaluation?: object;
  analysis_created_at?: Date;
}

export interface PaginatedGroupSessionAnalysis {
  data: GroupSessionAnalysis[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface PaginatedGroupSessionAnalysisApiResponse extends ApiResponse<PaginatedGroupSessionAnalysis> { };
