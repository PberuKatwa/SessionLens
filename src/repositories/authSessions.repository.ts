import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";
import { BaseAuthSession } from "@/types/authSession.types";

export async function createAuthSession(userId:number):Promise<BaseAuthSession> {
  try {

    const pgPool = getPgPool();
    const query = `
      WITH invalidate_old AS (
        UPDATE auth_sessions
        SET status = 'trash'
        WHERE user_id = $1 AND status = 'active'
      )
      INSERT INTO auth_sessions (user_id, expires_at, status)
      VALUES ($1, $2, 'active')
      RETURNING id;
    `;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const result = await pgPool.query(query, [userId, expiresAt]);
    const authSession:BaseAuthSession = result.rows[0];
    return authSession;
  } catch (error) {
    throw error;
  }
}

export async function getAuthSession(sessionId: string):Promise<BaseAuthSession> {
  try {

    const pgPool = getPgPool();
    const result = await pgPool.query(
      `
      SELECT id, user_id
      FROM auth_sessions
      WHERE id = $1
        AND status != 'trash'
        AND expires_at > NOW();
      `,
      [sessionId]
    );

    if (!result.rowCount || result.rowCount === 0) throw new Error(`No valid session`);

    const authSession: BaseAuthSession = result.rows[0];
    return authSession;
  } catch (error) {
    throw error;
  }
}

export async function trashAuthSession(id:string) {
  try {
    const pgPool = getPgPool();

    await pgPool.query(`UPDATE auth_sessions SET status=$1 WHERE id=$2;`,["trash", id])
    logger.info("Successfully trashed auth session");
  } catch (error) {
    throw error;
  }
}
