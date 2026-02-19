import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { evaluateSession } from "@/services/server/evaluation.service";
import { getAnalyzedSessionById } from "@/repositories/analyzedSessions.repository";
import { BaseAnalyzedSessionApiResponse, CompleteAnalyzedSessionApiResponse } from "@/types/analyzedSession.types";

async function createAnalyzedSession(
  req: NextRequest,
  session:BaseAuthSession,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;

    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    const analyzedSession = await evaluateSession(id);

    const response: BaseAnalyzedSessionApiResponse = {
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

async function getSession(
  req: NextRequest,
  session: BaseAuthSession,
  { params }: { params: { id: number } }
) {
  try {

    const { id } = await params;

    if (isNaN(id)) return NextResponse.json({ success:false, message: "Invalid ID" }, { status: 400 });

    const analyzedSession = await getAnalyzedSessionById(id);

    const response: CompleteAnalyzedSessionApiResponse = {
      success: true,
      message: "Successfully fetched analyzed session",
      data: analyzedSession
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("error fetching analyzed session", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(createAnalyzedSession);
export const GET = authMiddleware(getSession);
