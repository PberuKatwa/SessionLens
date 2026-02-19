import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";
import { MinimalAnalysisFilters } from "@/types/analysisFilters.types";
import {
  GroupSessionAnalysis,
  PaginatedGroupSessionAnalysis,
  PaginatedMinimalAnalysis
} from "@/types/groupSessionAnalysis.types";

export async function getSessionWithAnalysisBySessionId(sessionId: number): Promise<GroupSessionAnalysis> {
  try {
    const pgPool = getPgPool();

    const query = `
      SELECT
        gs.id AS session_id,
        gs.user_id,
        gs.group_id,
        gs.fellow_name,
        gs.is_processed,
        gs.transcript,
        gs.created_at AS session_created_at,

        ans.id AS analyzed_id,
        ans.is_safe,
        ans.review_status,
        ans.content_coverage,
        ans.facilitation_quality,
        ans.protocol_safety,
        ans.summary,
        ans.reviewer_id,
        ans.reviewer_comments,
        ans.llm_evaluation,
        ans.created_at AS analysis_created_at

      FROM group_sessions gs
      LEFT JOIN analyzed_sessions ans
        ON gs.id = ans.session_id

      WHERE gs.id = $1
        AND gs.row_status != 'trash'
        AND (ans.row_status IS NULL OR ans.row_status != 'trash');
    `;

    const result = await pgPool.query(query, [sessionId]);

    if (result.rowCount === 0)
      throw new Error("Session not found");

    return result.rows[0];

  } catch (error) {
    logger.error("Error fetching session with analysis", error);
    throw error;
  }
}

export async function getAllSessionsWithAnalysis(pageInput?: number, limitInput?: number):
  Promise<PaginatedGroupSessionAnalysis> {
  try {

    logger.warn("Fetching sessions with analysis");

    const page = pageInput ?? 1;
    const limit = limitInput ?? 10;
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT
        gs.id AS session_id,
        gs.user_id,
        gs.group_id,
        gs.fellow_name,
        gs.is_processed,
        gs.transcript,
        gs.created_at AS session_created_at,

        ans.id AS analyzed_id,
        ans.is_safe,
        ans.review_status,
        ans.content_coverage,
        ans.facilitation_quality,
        ans.protocol_safety,
        ans.summary,
        ans.reviewer_id,
        ans.reviewer_comments,
        ans.llm_evaluation,
        ans.created_at AS analysis_created_at

      FROM group_sessions gs
      LEFT JOIN analyzed_sessions ans
        ON gs.id = ans.session_id

      WHERE gs.row_status != 'trash'
        AND (ans.row_status IS NULL OR ans.row_status != 'trash')

      ORDER BY gs.id DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM group_sessions gs
      WHERE gs.row_status != 'trash';
    `;

    const pgPool = getPgPool();

    const [dataResult, countResult] = await Promise.all([
      pgPool.query(dataQuery, [limit, offset]),
      pgPool.query(countQuery),
    ]);

    const totalCount = parseInt(countResult.rows[0].count);

    return {
      data: dataResult.rows,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

  } catch (error) {
    logger.error("Error fetching paginated sessions with analysis", error);
    throw error;
  }
}

export async function minimalSessionsWithAnalysis(
  pageInput?: number,
  limitInput?: number,
  filters?:MinimalAnalysisFilters
):Promise<PaginatedMinimalAnalysis> {
  try {

    logger.warn("Fetching sessions with analysis");

    const page = pageInput ?? 1;
    const limit = limitInput ?? 10;
    const offset = (page - 1) * limit;

    const conditions: string[] = ["gs.row_status != 'trash'", "(ans.row_status IS NULL OR ans.row_status != 'trash')"];
    const values: any[] = [];
    let paramIndex = 1;

    // Processed
    if (filters?.is_processed !== null && filters?.is_processed !== undefined) {
      conditions.push(`gs.is_processed = $${paramIndex}`);
      values.push(filters.is_processed);
      paramIndex++;
    }

    // Safe
    if (filters?.is_safe !== null && filters?.is_safe !== undefined) {
      conditions.push(`ans.is_safe = $${paramIndex}`);
      values.push(filters.is_safe);
      paramIndex++;
    }

    // Review status
    if (filters?.review_status) {
      conditions.push(`ans.review_status = $${paramIndex}`);
      values.push(filters.review_status);
      paramIndex++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    values.push(limit);   // paramIndex
    values.push(offset);  // paramIndex + 1

    const dataQuery = `
      SELECT
        gs.id AS session_id,
        gs.group_id,
        gs.fellow_name,
        gs.is_processed,

        ans.id AS analyzed_id,
        ans.is_safe,
        ans.review_status,
        ans.content_coverage,
        ans.facilitation_quality,
        ans.protocol_safety,
        ans.created_at AS analysis_created_at

      FROM group_sessions gs
      LEFT JOIN analyzed_sessions ans
        ON gs.id = ans.session_id

      ${whereClause}

      ORDER BY gs.id DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM group_sessions gs
      LEFT JOIN analyzed_sessions ans
        ON gs.id = ans.session_id
      ${whereClause};
    `;

    const pgPool = getPgPool();

    const [dataResult, countResult] = await Promise.all([
      pgPool.query(dataQuery, values),
      pgPool.query(countQuery, values.slice(0, paramIndex - 1)), // only filter values
    ]);

    const totalCount = parseInt(countResult.rows[0].count);

    return {
      data: dataResult.rows,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

  } catch (error) {
    logger.error("Error fetching paginated sessions with analysis", error);
    throw error;
  }
}
