import { logger } from "@/lib/logger";

export async function parseJsonFile<T>(file: File | null): Promise<T> {
  try {

    if (!file) throw new Error("No file provided for parsing.");

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      logger.error(`Validation failed: File ${file.name} is not a JSON file.`);
      throw new Error("Invalid file format. Please upload a .json file.");
    }

    // 1. Extract raw text from the File blob
    const text = await file.text();

    // 2. Parse text into a JS Object
    const data = JSON.parse(text);

    return data as T;
  } catch (error) {
    logger.error(`Parsing error for file ${file.name}: ${error}`);
    throw new Error("Failed to parse JSON. The file content is malformed.");
  }
}
