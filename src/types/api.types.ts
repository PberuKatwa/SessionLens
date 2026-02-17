export interface ApiResponse < T = any > {
  success: boolean;
  message: string;
  data?: T;
}

export interface RouteParams {
  params: Promise<{ id: string }>;
}
