import { getAuthSession } from "@/repositories/authSessions.repository";
import { NextRequest, NextResponse } from "next/server";
import { getCookieId } from "./cookies";
import { BaseAuthSession } from "@/types/authSession.types";
import { AuthMiddlewareAppRouteHandler } from "@/types/api.types";

export function authMiddleware<T = any>(handler: AuthMiddlewareAppRouteHandler){
  return async (req: NextRequest, context: T) => {
    try {

      const { authSessionId } = await getCookieId();
      const session:BaseAuthSession = await getAuthSession(authSessionId);
      return handler(req, session, context);
    } catch (error) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 403 });
    }
  };
}
