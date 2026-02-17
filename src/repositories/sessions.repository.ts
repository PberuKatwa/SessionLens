import { getPgPool } from "@/lib/database";

export async function createSession(userId:number) {
  try {

    const pgPool = getPgPool();

    const query = `
      INSERT INTO sessions (user_id, expires_at)
      VALUES ($1, $2)
      RETURNING id;
    `;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const result = await pgPool.query(query,[userId,expiresAt]);
    const session = result.rows[0];

    return session
  } catch (error) {
    throw error;
  }
}
