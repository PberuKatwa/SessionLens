import { cookies } from "next/headers";
import { getSession } from "@/repositories/sessions.repository";
import { NextResponse } from "next/server";

export function authMiddleware(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get("session_id")?.value;

      if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const session = await getSession(sessionId);
      return handler(req, session, ...args);
    } catch (error) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }
  };
}
