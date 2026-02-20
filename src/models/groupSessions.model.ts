import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";

export async function createGroupSessionsTable() {
  try {

    const pgPool = await getPgPool();
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS group_sessions(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
        row_status row_status DEFAULT 'active',
        is_processed BOOLEAN NOT NULL DEFAULT FALSE,
        fellow_name VARCHAR(15) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

        transcript JSONB,

        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE RESTRICT
      );
    `);

    logger.info("Successfully group session table");
  } catch (error) {
    throw error;
  }
}
