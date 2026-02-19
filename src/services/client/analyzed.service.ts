import { apiClient } from "@/lib/apiClient";
import { PaginatedMinimalAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";


export const analyzedService = {

  async fetchMinimalAnalysis():Promise<PaginatedMinimalAnalysisApiResponse> {
    try {
      const response = await apiClient.get("/sessions/combined/minimal")

      const analyzed:PaginatedMinimalAnalysisApiResponse = response.data;
      return analyzed;
    } catch (error) {
      throw error;
    }
  }

}
