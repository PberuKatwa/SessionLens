import { logger } from "@/lib/logger";
import { createAnalyzedSession, getAllAnalyzedSessions } from "@/repositories/analyzedSessions.repository";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { BaseAnalyzedSessionApiResponse, CreateAnalyzedSessionPayload } from "@/types/analyzedSession.types";

async function createSession( req: NextRequest,session: BaseAuthSession) {
  try {

    const body:CreateAnalyzedSessionPayload = await req.json();

    const analyzedSession = await createAnalyzedSession(body);

    const response: BaseAnalyzedSessionApiResponse = {
      success: true,
      message: "Successfully created analyzed session",
      data: analyzedSession
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("error creating analyzed session", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
