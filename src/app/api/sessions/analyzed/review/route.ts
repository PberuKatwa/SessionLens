import { logger } from "@/lib/logger";
import { reviewAnalyzedSession } from "@/repositories/analyzedSessions.repository";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";

async function reviewSession(
  req: NextRequest,
  session: BaseAuthSession
) {
  try {
    const body = await req.json();

    await reviewAnalyzedSession(body);

    const response: ApiResponse = {
      success: true,
      message: "Successfully reviewed analyzed session"
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("error reviewing analyzed session", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(reviewSession);
