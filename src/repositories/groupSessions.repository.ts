import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";
import {
  GroupSession,
  CreateGroupSessionPayload,
  UpdateGroupSessionPayload,
  BaseGroupSession,
  PaginatedGroupSessions
} from "@/types/groupSession.types";

export async function createGroupSession(payload: CreateGroupSessionPayload): Promise<BaseGroupSession> {
  try {
    const pgPool = await getPgPool();
    const { user_id, group_id, fellow_name, transcript } = payload;

    const query = `
      INSERT INTO group_sessions (user_id, group_id, fellow_name, transcript)
      VALUES ($1, $2, $3, $4)
      RETURNING id, is_processed;
    `;

    const result = await pgPool.query(query, [user_id, group_id, fellow_name, transcript]);
    logger.info(`Successfully created group session for fellow: ${fellow_name}`);

    const groupSession = result.rows[0];
    return groupSession;
  } catch (error) {
    logger.error("Error in createGroupSession");
    throw error;
  }
}

export async function getGroupSessionById(id: number): Promise<GroupSession> {
  try {
    const pgPool = await getPgPool();
    const result = await pgPool.query(
      `SELECT * FROM group_sessions WHERE id = $1 AND row_status != 'trash';`,
      [id]
    );

    if (result.rowCount === 0) throw new Error("Group session not found");

    const getSingleSession = result.rows[0];
    return getSingleSession;
  } catch (error) {
    throw error;
  }
}

export async function getUnprocessedGroupSessionById(id: number): Promise<GroupSession> {
  try {
    const pgPool = await getPgPool();
    const result = await pgPool.query(
      `SELECT * FROM group_sessions WHERE id = $1 AND row_status != 'trash' AND is_processed IS FALSE; ;`,
      [id]
    );

    if (result.rowCount === 0) throw new Error("Group session not found");

    const getSingleSession = result.rows[0];
    return getSingleSession;
  } catch (error) {
    throw error;
  }
}

export async function getAllGroupSessions( pageInput?: number, limitInput?: number): Promise<PaginatedGroupSessions> {
  try {

    logger.warn(`Trying to fetch all group sessions from database.`);

    const page = pageInput ?? 1;
    const limit = limitInput ?? 10;
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT
        id,
        user_id,
        group_id,
        is_processed,
        fellow_name,
        created_at,
        transcript
      FROM group_sessions
      WHERE row_status != 'trash'
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM group_sessions
      WHERE row_status != 'trash';
    `;
    const pgPool = await getPgPool();

    const [dataResult, countResult] = await Promise.all([
      pgPool.query(dataQuery, [limit, offset]),
      pgPool.query(countQuery),
    ]);

    logger.info(`Successfully fetched group sessions`);

    const totalCount = parseInt(countResult.rows[0].count);

    return {
      groupSessions: dataResult.rows,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

  } catch (error) {
    throw error;
  }
}

export async function updateProcessedStatus(payload: UpdateGroupSessionPayload): Promise<void> {
  try {
    const pgPool = await getPgPool();
    const { id, is_processed } = payload;

    const query = `
      UPDATE group_sessions
      SET is_processed = $1
      WHERE id = $2;
    `;

    await pgPool.query(query, [is_processed, id]);
    logger.info(`Successfully updated group session ID: ${id}`);
  } catch (error) {
    throw error;
  }
}


export async function trashGroupSession(id: number): Promise<void> {
  try {
    const pgPool = await getPgPool();
    await pgPool.query(
      `UPDATE group_sessions SET row_status = 'trash' WHERE id = $1;`,
      [id]
    );
    logger.info(`Successfully trashed group session ID: ${id}`);
  } catch (error) {
    throw error;
  }
}
