import type { AuthUserApiResponse, ProfileApiResponse } from "@/types/user.types";
import { apiClient } from "@/lib/apiClient";

export const authService = {

  async login(email: string, password: string): Promise<AuthUserApiResponse> {
    const response = await apiClient.post("/auth/login", {
      email,
      password
    });

    return response.data;
  },

  async profile(): Promise<ProfileApiResponse> {
    const response = await apiClient.get("/auth/profile");

    return response.data;
  }

};
