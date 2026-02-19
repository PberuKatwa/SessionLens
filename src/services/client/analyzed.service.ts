import { apiClient } from "@/lib/apiClient";
import { PaginatedMinimalAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";


export const analyzedService = {

  async fetchMinimalAnalysis(page: number, limit: number): Promise<PaginatedMinimalAnalysisApiResponse> {
    try {
      // ?page=1&limit=1
      const response = await apiClient.get(`/sessions/combined/minimal/?page=${page}&limit=${limit}`)

      const analyzed:PaginatedMinimalAnalysisApiResponse = response.data;
      return analyzed;
    } catch (error) {
      throw error;
    }
  }

}
