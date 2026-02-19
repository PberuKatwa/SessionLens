import { apiClient } from "@/lib/apiClient";
import { PaginatedMinimalAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";
import { MinimalAnalysisFilters } from "../../types/analysisFilters.types";
import { ReviewStatus } from "@/types/globalTypes.types";

export const analyzedService = {
  async fetchMinimalAnalysis(
    page: number,
    limit: number,
    filters?: MinimalAnalysisFilters
  ): Promise<PaginatedMinimalAnalysisApiResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters) {
        if (filters.is_processed !== null) {
          params.append("is_processed", String(filters.is_processed));
        }
        if (filters.is_safe !== null) {
          params.append("is_safe", String(filters.is_safe));
        }
        if (filters.review_status !== null) {
          params.append("review_status", filters.review_status);
        }
      }

      const response = await apiClient.get(`/sessions/combined/minimal/?${params.toString()}`);

      const analyzed: PaginatedMinimalAnalysisApiResponse = response.data;
      return analyzed;
    } catch (error) {
      throw error;
    }
  },
};
