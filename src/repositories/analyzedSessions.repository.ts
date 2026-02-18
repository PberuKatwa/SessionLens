import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";
import {
  BaseAnalyzedSession,
  AnalyzedSession,
  CreateAnalyzedSessionPayload,
  ReviewerUpdatePayload,
  PaginatedAnalyzedSessions
} from "@/types/analyzedSession.types";

export async function createAnalyzedSession(payload: CreateAnalyzedSessionPayload): Promise<BaseAnalyzedSession>{
  try {
    const pgPool = getPgPool();
    const { session_id, is_safe, content_coverage, facilitation_quality, protocol_safety,
    summary, llm_evaluation } = payload;


    const query = `
      INSERT INTO analyzed_sessions (session_id, is_safe, content_coverage, facilitation_quality, protocol_safety,
      summary, llm_evaluation)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, summary, review_status;
    `;

    const result = await pgPool.query(query, [session_id, is_safe, content_coverage, facilitation_quality,
    protocol_safety, summary, llm_evaluation]);

    logger.info(`Successfully created analyzed session for session ID: ${session_id}`);

    const analyzedSession: BaseAnalyzedSession = result.rows[0];
    return analyzedSession;
  } catch (error) {
    logger.error("Error in createAnalyzedSession");
    throw error;
  }
}

export async function getAnalyzedSessionById(id: number): Promise<AnalyzedSession> {
  try {
    const pgPool = getPgPool();

    const result = await pgPool.query(
      `SELECT session_id, is_safe, content_coverage, facilitation_quality, protocol_safety, summary, created_at, llm_evaluation
        FROM analyzed_sessions WHERE id = $1 AND row_status != 'trash';`,
      [id]
    );

    if (result.rowCount === 0) throw new Error("Analyzed session not found");
    const analyzedSession: AnalyzedSession = result.rows[0];
    return analyzedSession;
  } catch (error) {
    throw error;
  }
}

export async function getAllAnalyzedSessions(pageInput?: number,limitInput?: number): Promise<PaginatedAnalyzedSessions> {
  try {
    logger.warn(`Trying to fetch analyzed sessions`);

    const page = pageInput ?? 1;
    const limit = limitInput ?? 10;
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT session_id, is_safe, content_coverage, facilitation_quality, protocol_safety, summary, created_at, llm_evaluation
      FROM analyzed_sessions
      WHERE row_status != 'trash'
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM analyzed_sessions
      WHERE row_status != 'trash';
    `;

    const pgPool = getPgPool();

    const [dataResult, countResult] = await Promise.all([
      pgPool.query(dataQuery, [limit, offset]),
      pgPool.query(countQuery),
    ]);

    const totalCount = parseInt(countResult.rows[0].count);

    return {
      analyzedSessions: dataResult.rows,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

  } catch (error) {
    throw error;
  }
}

export async function reviewAnalyzedSession( payload: ReviewerUpdatePayload): Promise<void> {
  try {
    const pgPool = getPgPool();

    const {
      id,
      is_safe,
      review_status,
      content_coverage,
      facilitation_quality,
      protocol_safety,
      reviewer_id,
      reviewer_comments
    } = payload;

    const query = `
      UPDATE analyzed_sessions
      SET
        is_safe = $1,
        review_status = $2,
        content_coverage = $3,
        facilitation_quality = $4,
        protocol_safety = $5,
        reviewer_id = $6,
        reviewer_comments = $7
      WHERE id = $8;
    `;

    await pgPool.query(query, [
      is_safe,
      review_status,
      content_coverage,
      facilitation_quality,
      protocol_safety,
      reviewer_id,
      reviewer_comments || null,
      id,
    ]);

    logger.info(`Successfully reviewed analyzed session ID: ${id}`);

  } catch (error) {
    throw error;
  }
}
