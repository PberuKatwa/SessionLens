import { getPgPool } from "../lib/database";
import { logger } from "@/lib/logger";

export async function createSessionsTable() {
  try {
    const pgPool = getPgPool();

    const query = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id INTEGER NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE

      );
    `;

    await pgPool.query(query);
    logger.info("sessions table created successfully");
  } catch (error) {
    throw error;
  }
}
