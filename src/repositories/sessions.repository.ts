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

export async function getSession(sessionId: string) {
  try {

    const pgPool = getPgPool();

    const result = await pgPool.query(
      `
      SELECT user_id
       FROM sessions
       WHERE id = $1
       AND expires_at > NOW();
      `,
      [sessionId]
    );

    if (!result.rowCount || result.rowCount === 0) throw new Error(`No valid session`);

    const session = result.rows[0];
    return session;
  } catch (error) {
    throw error;
  }
}
