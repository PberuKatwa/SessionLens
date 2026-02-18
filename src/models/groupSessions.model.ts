import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";

export async function createGroupSessions() {
  try {

    const pgPool = getPgPool();

    await pgPool.query(`

      CREATE TABLE group_sessions IF NOT EXISTS(
        id PRIMARY KEY,
        user_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        row_status row_status DEFAULT 'active',
        is_processed BOOLEAN NOT NULL DEFAULT FALSE,
        fellow_name VARCHAR(15) NOT NULL,
        created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,

        transcript JSONB,

        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );

    `);

    logger.info("Successfully analyzed group session table");
  } catch (error) {
    throw error;
  }
}
