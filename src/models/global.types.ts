import { logger } from "@/lib/logger";
import { getPgPool } from "../lib/database";

export async function initializeTypes() {
  try {
    const pgPool = getPgPool();
    const query = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'row_status') THEN
          CREATE TYPE row_status AS ENUM ('active', 'trash', 'pending');
        END IF;
      END
      $$;

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
          CREATE TYPE review_status AS ENUM ('unreviewed','accepted','rejected');
        END IF;
      END
      $$;

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('fellow', 'supervisor', 'expert', 'demo');
        END IF;
      END
      $$;
    `;
    await pgPool.query(query);
    logger.info(`Successfully intialized types`)
  } catch (error) {
    throw error;
  }

}
