import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";
import { BaseSession } from "@/types/session.types";

export async function createSession(userId:number):Promise<BaseSession> {
  try {

    const pgPool = getPgPool();
    const query = `
      WITH invalidate_old AS (
        UPDATE sessions
        SET status = 'trash'
        WHERE user_id = $1 AND status = 'active'
      )
      INSERT INTO sessions (user_id, expires_at, status)
      VALUES ($1, $2, 'active')
      RETURNING id;
    `;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const result = await pgPool.query(query, [userId, expiresAt]);
    const session:BaseSession = result.rows[0];
    return session;
  } catch (error) {
    throw error;
  }
}

export async function getSession(sessionId: string):Promise<BaseSession> {
  try {

    const pgPool = getPgPool();
    const result = await pgPool.query(
      `
      SELECT user_id
      FROM sessions
      WHERE id = $1
        AND status != 'trash'
        AND expires_at > NOW();
      `,
      [sessionId]
    );

    if (!result.rowCount || result.rowCount === 0) throw new Error(`No valid session`);

    const session: BaseSession = result.rows[0];
    return session;
  } catch (error) {
    throw error;
  }
}

export async function trashSession(id:string) {
  try {
    const pgPool = getPgPool();

    await pgPool.query(`UPDATE sessions SET status=$1 WHERE id=$2;`,["trash", id])

    logger.info("Successfully trashed session");
  } catch (error) {
    throw error;
  }
}
