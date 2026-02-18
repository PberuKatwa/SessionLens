import { ApiResponse } from "./api.types";

export interface BaseGroupSession{
  id: number;
  is_processed: boolean;
}

export interface GroupSession extends BaseGroupSession {
  user_id: number;
  group_id: number;
  is_processed: boolean;
  fellow_name: string;
  created_at: Date;
  transcript: any;
}

export interface CreateGroupSessionPayload {
  user_id: number;
  group_id: number;
  fellow_name: string;
  transcript: object;
}

export interface UpdateGroupSessionPayload extends BaseGroupSession { };
export interface SingleGroupSessionApiResponse extends ApiResponse<BaseGroupSession> { };
