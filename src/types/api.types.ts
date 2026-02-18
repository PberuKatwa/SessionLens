import { NextRequest, NextResponse } from "next/server";
import { BaseAuthSession } from "./authSession.types";

export interface ApiResponse < T = any > {
  success: boolean;
  message: string;
  data?: T;
}

export interface RouteParams {
  params: Promise<{ id: string }>;
}

export type AuthMiddlewareAppRouteHandler<T = any> = (req: NextRequest, session: BaseAuthSession, context: T) => Promise<NextResponse>;
