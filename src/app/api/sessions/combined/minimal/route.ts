import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { BaseAuthSession } from "@/types/authSession.types";
import { PaginatedMinimalAnalysisApiResponse } from "@/types/groupSessionAnalysis.types";
import { minimalSessionsWithAnalysis } from "@/repositories/groupSessionAnalysis.repository";
import { MinimalAnalysisFilters } from "@/types/analysisFilters.types";
import { parseBoolean, parseReviewStatus } from "@/lib/parsers";



async function getMinimalCombinedSessions(
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

    console.log( "filters", filters);

    const result = await minimalSessionsWithAnalysis(page, limit,filters);

    const response: PaginatedMinimalAnalysisApiResponse = {
      success: true,
      message: "Successfully fetched sessions with minimal analysis",
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

export const GET = authMiddleware(getMinimalCombinedSessions);
