import { cookies } from "next/headers";
import { getAuthSession } from "@/repositories/sessions.repository";
import { NextResponse } from "next/server";
import { getCookieId } from "./cookies";

export function authMiddleware(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const { authSessionId } = await getCookieId();

      const session = await getAuthSession(authSessionId);
      return handler(req, session, ...args);
    } catch (error) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }
  };
}
