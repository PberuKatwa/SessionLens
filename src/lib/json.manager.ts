import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/lib/logger";

/**
 * PATH UTILITY: Defines where JSON files are stored.
 * Defaulting to a 'data' folder in your project root.
 */
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Ensures the data directory exists before writing
 */
async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if directory already exists
  }
}

/**
 * WRITE: Converts a JavaScript Object/Text to a JSON file
 * @param fileName - e.g., 'session_123.json'
 * @param data - The object or string to be stringified
 */
export async function writeJsonFile(fileName: string, data: any): Promise<void> {
  try {
    await ensureDir();
    const filePath = path.join(DATA_DIR, fileName);

    // Ensure we are working with a string
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    await fs.writeFile(filePath, jsonString, 'utf8');
    logger.info(`Successfully created JSON file: ${fileName}`);
  } catch (error) {
    logger.error(`Error writing JSON file: ${fileName}`);
    throw error;
  }
}

/**
 * READ: Parses a JSON file back into a JavaScript Object
 * @param fileName - e.g., 'session_123.json'
 */
export async function readJsonFile<T>(fileName: string): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.readFile(filePath, 'utf8');

    // Convert text back to Object
    const parsedData = JSON.parse(content);
    return parsedData as T;
  } catch (error) {
    logger.error(`Error parsing JSON file: ${fileName}`);
    throw error;
  }
}

/**
 * DELETE: Removes a JSON file from the disk
 */
export async function deleteJsonFile(fileName: string): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    await fs.unlink(filePath);
    logger.info(`Deleted JSON file: ${fileName}`);
  } catch (error) {
    logger.error(`Failed to delete JSON file: ${fileName}`);
    throw error;
  }
}
