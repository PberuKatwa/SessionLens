import { ApiResponse } from "./api.types";
import { ReviewStatus } from "./globalTypes.types";

export interface GroupSessionAnalysis {
  session_id: number;

  // Group Session
  user_id: number;
  group_id: number;
  fellow_id: number;
  fellow_name: string;
  is_processed: boolean;
  transcript: object;
  session_created_at: Date;

  // Analysis
  analyzed_id?: number;
  is_safe?: boolean;
  review_status?: ReviewStatus;
  content_coverage?: number;
  facilitation_quality?: number;
  protocol_safety?: number;
  summary?: string;
  reviewer_id?: number;
  reviewer_comments?: string;
  llm_evaluation?: object;
  analysis_created_at?: Date;
}

export interface MinimalAnalysis {
  session_id: number;

  // Group Session
  group_id: number;
  fellow_id: number;
  fellow_name: string;
  is_processed: boolean;

  // Analysis
  analyzed_id?: number;
  is_safe?: boolean;
  review_status?: ReviewStatus;
  content_coverage?: number;
  facilitation_quality?: number;
  protocol_safety?: number;
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

export interface PaginatedMinimalAnalysis{
  data: MinimalAnalysis[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface PaginatedGroupSessionAnalysisApiResponse extends ApiResponse<PaginatedGroupSessionAnalysis> { };
export interface GroupSessionAnalysisApiResponse extends ApiResponse<GroupSessionAnalysis> { };
export interface PaginatedMinimalAnalysisApiResponse extends ApiResponse<PaginatedMinimalAnalysis> { };
