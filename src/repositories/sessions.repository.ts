import { getPgPool } from "@/lib/database";

export async function createSession() {
  try {

    const pgPool = getPgPool();

  } catch (error) {
    throw error;
  }
}
