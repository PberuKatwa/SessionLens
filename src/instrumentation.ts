import { logger } from "./lib/logger";
import { initDatabase } from "./models/init.models";


export async function register() {
  logger.info("Running startup initialization...");
  try {
    await initDatabase();
  } catch (error) {
    logger.error("Database initialization failed", error);
  }
}
