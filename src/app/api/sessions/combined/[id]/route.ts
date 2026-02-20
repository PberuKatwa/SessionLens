import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { BaseAuthSession } from "@/types/authSession.types";
import { ApiResponse } from "@/types/api.types";
import { GroupSessionAnalysis, GroupSessionAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";
import { getSessionWithAnalysisBySessionId } from "@/repositories/groupSessionAnalysis.repository";

async function getCombinedSessionById(
  req: NextRequest,
  session: BaseAuthSession,
  { params }: { params: { id: number } }) {
  try {
    const { id } = await params;

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const result = await getSessionWithAnalysisBySessionId(id);

    const response: GroupSessionAnalysisApiResponse= {
      success: true,
      message: "Successfully fetched session with analysis",
      data: result
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("Error fetching combined session", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(getCombinedSessionById);
