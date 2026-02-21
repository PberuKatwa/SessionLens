import { ApiResponse } from "./api.types";
import { RowStatus } from "./globalTypes.types";

export interface BaseFellow {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Fellow extends BaseFellow {
  email: string;
}

export interface CreateFellowPayload {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateFellowPayload {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  status: RowStatus | null;
}

export interface PaginatedFellows {
  fellows: Fellow[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface BaseFellowApiResponse extends ApiResponse<BaseFellow> {}
export interface CompleteFellowApiResponse extends ApiResponse<Fellow> {}
export interface PaginatedFellowApiResponse extends ApiResponse<PaginatedFellows> {}
