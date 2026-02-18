import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { BaseAuthSession } from "@/types/authSession.types";
import {  PaginatedGroupSessionAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";
import { getAllSessionsWithAnalysis } from "@/models/groupSessionAnalysis.repository";



async function getAllCombinedSessions(
  req: NextRequest,
  session: BaseAuthSession
) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getAllSessionsWithAnalysis(page, limit);

    const response: PaginatedGroupSessionAnalysisApiResponse = {
      success: true,
      message: "Successfully fetched sessions with analysis",
      data: result
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("Error fetching combined sessions", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(getAllCombinedSessions);
