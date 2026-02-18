import { logger } from "@/lib/logger";
import { getGroupSessionById } from "@/repositories/groupSessions.repository";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { CompleteGroupSessionApiResponse, SingleGroupSessionApiResponse } from "@/types/groupSession.types";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { evaluateSession } from "@/services/evaluation.service";

async function createAnalyzedSession(
  req: NextRequest,
  session:BaseAuthSession,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;

    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    const analyzedSession = await evaluateSession(id);

    const response: ApiResponse = {
      success: true,
      message: "Successfully anlayzed session",
      data:analyzedSession
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error:any) {

    logger.error(`error in fetching analyzed session`, error);
    const response: ApiResponse = {
      success: false,
      message:`${error.message}`
    }
    return NextResponse.json(response, { status: 500 });
  }
}

export const GET = authMiddleware(createAnalyzedSession);
