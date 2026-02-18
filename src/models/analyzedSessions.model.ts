import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";

export async function createAnalyzedSessionsTable() {
  try {

    const pgPool = getPgPool();

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS analyzed_sessions(
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        is_safe BOOLEAN NOT NULL DEFAULT TRUE,
        row_status row_status DEFAULT 'active',

        review_status review_status DEFAULT 'unreviewed',
        content_coverage INTEGER NOT NULL DEFAULT 0,
        facilitation_quality INTEGER NOT NULL DEFAULT 0,
        protocol_safety INTEGER NOT NULL DEFAULT 0,
        summary VARCHAR(240) NOT NULL,

        reviewer_id INTEGER,
        reviewer_comments TEXT,

        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        llm_evaluation JSONB,

        FOREIGN KEY (session_id)
          REFERENCES group_sessions(id)
          ON DELETE CASCADE,

        FOREIGN KEY(reviewer_id)
          REFERENCES users(id)
          ON DELETE RESTRICT
      )
    `);

    logger.info("Successfully created analyzed session table");
  } catch (error) {
    throw error;
  }
}
