import { apiClient } from "@/lib/apiClient";
import { GroupSessionAnalysisApiResponse, PaginatedMinimalAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";
import { MinimalAnalysisFilters } from "../../types/analysisFilters.types";
import { SingleGroupSessionApiResponse } from "@/types/groupSession.types";
import { BaseAnalyzedSessionApiResponse } from "@/types/analyzedSession.types";
import { ApiResponse } from "@/types/api.types";

export type CreateGroupSessionPayload = {
  fellowName: string;
  groupId: number;
  transcriptFile: File | null;
};

export const analyzedService = {

  async fetchMinimalAnalysis(page: number, limit: number, filters?: MinimalAnalysisFilters):
    Promise<PaginatedMinimalAnalysisApiResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters) {
        if (filters.is_processed !== null) {
          params.append("isProcessed", String(filters.is_processed));
        }
        if (filters.is_safe !== null) {
          params.append("isSafe", String(filters.is_safe));
        }
        if (filters.review_status !== null) {
          params.append("reviewStatus", filters.review_status);
        }
      }

      const allParams = params.toString()
      const response = await apiClient.get(`/sessions/combined/minimal/?${allParams}`);

      const analyzed: PaginatedMinimalAnalysisApiResponse = response.data;
      return analyzed;
    } catch (error) {
      throw error;
    }
  },

  async createGroupSession(payload: CreateGroupSessionPayload):Promise<SingleGroupSessionApiResponse> {
    try {
      const form = new FormData();

      form.append("fellowName", payload.fellowName);
      form.append("groupId", String(payload.groupId));

      if (!payload.transcriptFile) throw new Error("Transcript JSON file is required");
      form.append("transcriptFile", payload.transcriptFile);

      const response = await apiClient.post(
        "/sessions/group",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async evaluateSessionClient(sessionId:number):Promise<BaseAnalyzedSessionApiResponse> {
    try {

      const response = await apiClient.post(`/sessions/analyzed/${sessionId}`);
      const session:BaseAnalyzedSessionApiResponse = response.data;
      return session
    } catch (error) {
      throw error;
    }
  },

  async trashSessionClient(sessionId:number):Promise<ApiResponse> {
    try {

      const response = await apiClient.post(`/sessions/group/${sessionId}/trash`);
      const session:ApiResponse = response.data;
      return session
    } catch (error) {
      throw error;
    }
  },

  async fetchFullGroupAnalysis(id: number):Promise<GroupSessionAnalysisApiResponse> {
    try {

      const response = await apiClient.get(`/sessions/combined/${id}`);
      const session: GroupSessionAnalysisApiResponse = response.data;
      return session;
    } catch (error) {
      throw error;
    }
  }

};
