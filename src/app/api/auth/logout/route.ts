import { authMiddleware } from "@/lib/auth.wrapper";
import { logger } from "@/lib/logger";
import { trashSession } from "@/repositories/sessions.repository";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function logout() {
  try {

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_id");
    const sessionId = sessionCookie?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    cookieStore.delete("session_id");
    logger.info(`Succesfully logged out user`)
    await trashSession(sessionId)

    const response: ApiResponse = {
      success: false,
      message:"Successfully logged out"
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error:any) {
    logger.error(`Error in logging out`, error)
    return NextResponse.json({ success: false, message: `${error.message}` }, { status: 500 });
  }
}

export const POST = authMiddleware(logout);
