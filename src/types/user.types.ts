import type { ApiResponse } from "./api.types";

export interface BaseUser {
  first_name: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload{
  id: number;
  firstName: string;
  lastName: string;
  fileId: number | null;
}

export interface SignedUser {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
};

export interface AuthUser extends BaseUser {
  id: number;
  access_token: string;
};

export interface UserProfile extends BaseUser {
  id: number;
  last_name: string;
  file_id: number | null;
  file_url: string | null;
  signed_url: string | null;
}

export interface UserApiResponse extends ApiResponse<BaseUser> { };
export interface AuthUserApiResponse extends ApiResponse<AuthUser> { };
export interface ProfileApiResponse extends ApiResponse<UserProfile> { };
