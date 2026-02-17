import { getPgPool } from "@/lib/database";

export async function createSession() {
  try {

    const pgPool = getPgPool();

    const query = `
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const result = await pgPool.query(query);
    const session = result.rows[0];

    return session
  } catch (error) {
    throw error;
  }
}
