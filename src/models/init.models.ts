import { logger } from "@/lib/logger";
import { initializeTypes } from "./global.types";
import { createUsersTable } from "./users.model";
import { createSessionsTable } from "./session.model";

export async function initDatabase() {
  try {
    await initializeTypes();
    await createUsersTable();
    await createSessionsTable();
    logger.info("Database initialization complete");
  } catch (error) {
    throw error;
  }
}
