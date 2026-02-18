import { ApiResponse } from "./api.types";
import { ReviewStatus } from "./globalTypes.types";

export interface BaseAnalyzedSession {
  id: number;
  summary: string;
  review_status: ReviewStatus;
}

export interface AnalyzedSession extends BaseAnalyzedSession {
  session_id: number;
  is_safe: boolean;
  content_coverage: number;
  facilitation_quality: number;
  protocol_safety: number;
  summary: string;
  created_at: Date;
  llm_evaluation: object;
}

export interface ReviewedAnalyzedSession extends AnalyzedSession{
  reviewer_id: number;
  reviewer_comments: string;
}

export interface CreateAnalyzedSessionPayload {
  session_id: number;
  is_safe: boolean;
  content_coverage: number;
  facilitation_quality: number;
  protocol_safety: number;
  summary: string;
  llm_evaluation: object;
}

export interface ReviewerUpdatePayload {
  id: number;
  is_safe: boolean;
  review_status: ReviewStatus;
  content_coverage: number;
  facilitation_quality: number;
  protocol_safety: number;
  reviewer_id: number;
  reviewer_comments: string;
}

export interface PaginatedAnalyzedSessions {
  analyzedSessions: AnalyzedSession[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface CompleteAnalyzedSessionApiResponse extends ApiResponse<AnalyzedSession> {}
export interface PaginatedAnalyzedSessionApiResponse extends ApiResponse<PaginatedAnalyzedSessions> {}
