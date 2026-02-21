import { getPgPool } from "../lib/database";
import { logger } from "@/lib/logger";

export async function createFellowsTable() {
  try {
    const pgPool = await getPgPool();

    const query = `
      CREATE TABLE IF NOT EXISTS fellows (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        status row_status DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pgPool.query(query);
    logger.info("Fellows table created successfully");
  } catch (error) {
    throw error;
  }
}
