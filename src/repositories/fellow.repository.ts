import { getPgPool } from "@/lib/database";
import { logger } from "@/lib/logger";
import {
  BaseFellow,
  Fellow,
  CreateFellowPayload,
  UpdateFellowPayload,
  PaginatedFellows
} from "@/types/fellows.types";

export async function createFellow(payload: CreateFellowPayload): Promise<BaseFellow> {
  try {
    const pgPool = await getPgPool();
    const { first_name, last_name, email } = payload;

    const query = `
      INSERT INTO fellows (first_name, last_name, email)
      VALUES ($1, $2, $3)
      RETURNING id, first_name, last_name, email;
    `;

    const result = await pgPool.query(query, [first_name, last_name, email]);

    logger.info(`Successfully created fellow: ${email}`);

    return result.rows[0];

  } catch (error) {
    throw error;
  }
}

export async function getFellowById(id: number): Promise<Fellow> {
  try {
    const pgPool = await getPgPool();

    const result = await pgPool.query(
      `SELECT id, first_name, last_name, email, status, created_at
       FROM fellows
       WHERE id = $1 AND status != 'trash';`,
      [id]
    );

    if (result.rowCount === 0) throw new Error("Fellow not found");

    return result.rows[0];

  } catch (error) {
    throw error;
  }
}

export async function getAllFellows(pageInput?: number, limitInput?: number): Promise<PaginatedFellows> {
  try {
    logger.warn(`Trying to fetch fellows`);

    const page = pageInput ?? 1;
    const limit = limitInput ?? 10;
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT id, first_name, last_name, email, status, created_at
      FROM fellows
      WHERE status != 'trash'
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM fellows
      WHERE status != 'trash';
    `;

    const pgPool = await getPgPool();

    const [dataResult, countResult] = await Promise.all([
      pgPool.query(dataQuery, [limit, offset]),
      pgPool.query(countQuery),
    ]);

    const totalCount = parseInt(countResult.rows[0].count);

    return {
      fellows: dataResult.rows,
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

export async function trashFellow(id: number): Promise<void> {
  try {
    const pgPool = await getPgPool();

    await pgPool.query(
      `UPDATE fellows SET status = 'trash' WHERE id = $1;`,
      [id]
    );

    logger.info(`Successfully trashed fellow ID: ${id}`);

  } catch (error) {
    throw error;
  }
}
