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
