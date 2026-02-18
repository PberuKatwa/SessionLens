import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";

export async function createAnalyzedSessionsTable() {
  try {

    const pgPool = getPgPool();

    await pgPool.query(`
      CREATE TABLE analyzed_sessions IF NOT EXISTS(
        id PRIMARY KEY,
        session_id INTEGER NOT NULL,
        is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
        row_status row_status DEFAULT 'active',

        status risk_status DEFAULT 'safe',
        content_coverage INTEGER NOT NULL DEFAULT 0,
        facilitation_quality INTEGER NOT NULL DEFAULT 0,
        protocol_safety INTEGER NOT NULL DEFAULT 0,
        summary VARCHAR(240) NOT NULL,

        created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,

        llm_evaluation JSONB,

        FOREIGN KEY (session_id)
          REFERENCES sessions(id)
          ON DELETE CASCADE
      )
    `)

    logger.info("Successfully created analyzed session table");
  } catch (error) {
    throw error;
  }
}

// Fellow Name, Date, Group ID, and a Status (e.g.,
// Processed, Flagged for Review, Safe).
