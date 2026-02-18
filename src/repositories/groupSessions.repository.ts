import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";
import {
  GroupSession,
  CreateGroupSessionPayload,
  UpdateGroupSessionPayload,
  RowStatus
} from "@/types/groupSession.types";

/**
 * CREATE: Create a new group session
 */
export async function createGroupSession(payload: CreateGroupSessionPayload): Promise<GroupSession> {
  try {
    const pgPool = getPgPool();
    const { user_id, group_id, fellow_name, transcript } = payload;

    const query = `
      INSERT INTO group_sessions (user_id, group_id, fellow_name, transcript)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await pgPool.query(query, [user_id, group_id, fellow_name, transcript]);
    logger.info(`Successfully created group session for fellow: ${fellow_name}`);
    return result.rows[0];
  } catch (error) {
    logger.error("Error in createGroupSession");
    throw error;
  }
}

/**
 * READ: Get a single session by ID
 */
export async function getGroupSessionById(id: number): Promise<GroupSession> {
  try {
    const pgPool = getPgPool();
    const result = await pgPool.query(
      `SELECT * FROM group_sessions WHERE id = $1 AND row_status != 'trash';`,
      [id]
    );

    if (result.rowCount === 0) throw new Error("Group session not found");

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * UPDATE: Update general session data (transcript/processed status)
 */
export async function updateGroupSession(id: number, payload: UpdateGroupSessionPayload): Promise<GroupSession> {
  try {
    const pgPool = getPgPool();
    const { is_processed, transcript, fellow_name } = payload;

    // Standard pattern for dynamic updates if needed,
    // but here we'll keep it direct for the table structure
    const query = `
      UPDATE group_sessions
      SET
        is_processed = COALESCE($1, is_processed),
        transcript = COALESCE($2, transcript),
        fellow_name = COALESCE($3, fellow_name)
      WHERE id = $4
      RETURNING *;
    `;

    const result = await pgPool.query(query, [is_processed, transcript, fellow_name, id]);
    logger.info(`Successfully updated group session ID: ${id}`);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * STATUS UPDATE: Specifically change the row_status (Review Status)
 */
export async function updateGroupSessionStatus(id: number, status: RowStatus): Promise<void> {
  try {
    const pgPool = getPgPool();
    await pgPool.query(
      `UPDATE group_sessions SET row_status = $1 WHERE id = $2;`,
      [status, id]
    );
    logger.info(`Successfully updated status to ${status} for session ID: ${id}`);
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE: Move to 'trash' status (Soft Delete)
 */
export async function trashGroupSession(id: number): Promise<void> {
  try {
    const pgPool = getPgPool();
    await pgPool.query(
      `UPDATE group_sessions SET row_status = 'trash' WHERE id = $1;`,
      [id]
    );
    logger.info(`Successfully trashed group session ID: ${id}`);
  } catch (error) {
    throw error;
  }
}
