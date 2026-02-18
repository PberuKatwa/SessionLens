// @/types/groupSession.types.ts

export type RowStatus = 'active' | 'trash' | 'archived';

export interface GroupSession {
  id: number;
  user_id: number;
  group_id: number;
  row_status: RowStatus;
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

export interface UpdateGroupSessionPayload {
  is_processed: boolean;
}
