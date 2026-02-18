import { authMiddleware } from "@/lib/auth.middleware";
import { deleteCookie } from "@/lib/cookies";
import { logger } from "@/lib/logger";
import { trashAuthSession } from "@/repositories/sessions.repository";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function logout() {
  try {

    const authSessionId = await deleteCookie();
    await trashAuthSession(authSessionId)

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
