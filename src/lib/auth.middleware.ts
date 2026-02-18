import { getAuthSession } from "@/repositories/authSessions.repository";
import { NextRequest, NextResponse } from "next/server";
import { getCookieId } from "./cookies";
import { BaseAuthSession } from "@/types/authSession.types";

export function authMiddleware(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    try {

      const { authSessionId } = await getCookieId();
      const session:BaseAuthSession = await getAuthSession(authSessionId);
      return handler(req, session, ...args);
    } catch (error) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 403 });
    }
  };
}
