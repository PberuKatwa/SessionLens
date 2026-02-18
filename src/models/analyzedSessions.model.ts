import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";

export async function createGroupSessions() {
  try {

    const pgPool = getPgPool();

    await pgPool.query(`
      CREATE TABLE analyzed_sessions IF NOT EXISTS(
        id PRIMARY KEY,
        session_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,

        is_processed BOOLEAN NOT NULL DEFAULT FALSE,
        is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,

        status risk_status DEFAULT 'safe',
        summary VARCHAR(240) NOT NULL,
        fellow_name VARCHAR(15) NOT NULL,
        created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,

        transcript JSONB,
        llm_evaluation JSONB
      )
    `)

    logger.info("Successfully analyzed group session table");
  } catch (error) {
    throw error;
  }
}

// Fellow Name, Date, Group ID, and a Status (e.g.,
// Processed, Flagged for Review, Safe).
