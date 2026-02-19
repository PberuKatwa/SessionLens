import type { AuthUser, AuthUserApiResponse, ProfileApiResponse } from "@/types/user.types";
import { apiClient } from "@/lib/apiClient";

export const authService = {

  async login(email: string, password: string): Promise<AuthUserApiResponse> {

    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password
      });

      const user: AuthUserApiResponse = response.data;
      return user
    } catch (error) {
      throw error
    }

  },

  async profile(): Promise<ProfileApiResponse> {
    try {
      const response = await apiClient.get("/auth/profile");
      const user:ProfileApiResponse = response.data;
      return user;
    } catch (error) {
      throw error;
    }

  }

};
