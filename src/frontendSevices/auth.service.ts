import type { AuthUserApiResponse, ProfileApiResponse } from "../types/user.types";
import { apiClient, authorizedApiClient } from "./api.client";

export const authService = {

  async signUp( firstName:string, lastName:string, email:string, password:string ) {
    try {
      const response = await apiClient.post("/auth/register", {
        firstName,lastName,email,password
      })

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login( email:string, password:string ) {
    try {

      const response = await apiClient.post("/auth/login", { email, password })
      const loginRes: AuthUserApiResponse = response.data;
      if (!loginRes.data?.access_token) throw new Error(`Invalid login, try agin`);
      return loginRes;

    } catch (error) {
      throw error;
    }
  },

  async profile() {
    try {
      const response = await authorizedApiClient.get("/auth/profile")
      const profileData: ProfileApiResponse = response.data;
      return profileData;
    } catch (error) {
      throw error;
    }
  }

}
