import { logger } from "@/lib/logger";
import { initializeTypes } from "./global.types";
import { createUsersTable } from "./users.model";
import { createAuthSessionsTable } from "./authSessions.model";

export async function initDatabase() {
  try {
    await initializeTypes();
    await createUsersTable();
    await createAuthSessionsTable();
    logger.info("Database initialization complete");
  } catch (error) {
    throw error;
  }
}
