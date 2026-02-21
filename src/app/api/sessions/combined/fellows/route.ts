import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { BaseAuthSession } from "@/types/authSession.types";
import { PaginatedFellowInsightApiResponse, PaginatedMinimalAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";
import {  paginatedFellowInsights } from "@/repositories/groupSessionAnalysis.repository";
import { MinimalAnalysisFilters } from "@/types/analysisFilters.types";
import { parseBoolean, parseReviewStatus } from "@/lib/parsers";



async function getFellowAnalysedSessions(
  req: NextRequest,
  session: BaseAuthSession
) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const filters: MinimalAnalysisFilters = {
      is_processed: parseBoolean(searchParams.get("isProcessed")),
      is_safe: parseBoolean(searchParams.get("isSafe")),
      review_status: parseReviewStatus(searchParams.get("reviewStatus")),
    };

    const result = await paginatedFellowInsights(page, limit,filters);
    const response: PaginatedFellowInsightApiResponse = {
      success: true,
      message: "Successfully fetched sessions with fellow level analysis",
      data: result
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("Error fetching fellow level analysis", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(getFellowAnalysedSessions);
