import { getPgPool } from "../lib/database";
import { logger } from "@/lib/logger";

export async function createUsersTable() {
  try {
    const pgPool = getPgPool();

    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        status row_status DEFAULT 'active',
        role user_role DEFAULT 'demo',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pgPool.query(query);
    logger.info("Users table created successfully");
  } catch (error) {
    throw error;
  }
}
