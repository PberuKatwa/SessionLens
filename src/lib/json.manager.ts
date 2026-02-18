
export async function parseJsonFile<T>(file: File | null): Promise<T> {
  try {

    if (!file) throw new Error("No file provided for parsing.");
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      throw new Error("Invalid file format. Please upload a .json file.");
    }

    const text = await file.text();
    const data = JSON.parse(text);

    return data as T;
  } catch (error) {
    throw new Error("Failed to parse JSON. The file content is malformed.");
  }
}
