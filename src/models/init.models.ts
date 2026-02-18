import { logger } from "@/lib/logger";
import { initializeTypes } from "./global.types";
import { createUsersTable } from "./users.model";
import { createAuthSessionsTable } from "./authSessions.model";
import { createGroupSessionsTable } from "./groupSessions.model";
import { createAnalyzedSessionsTable } from "./analyzedSessions.model";

export async function initDatabase() {
  try {
    await initializeTypes();
    await createUsersTable();
    await createAuthSessionsTable();
    await createGroupSessionsTable();
    await createAnalyzedSessionsTable();
    logger.info("Database initialization complete");
  } catch (error) {
    throw error;
  }
}
