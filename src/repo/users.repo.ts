import { getPgPool } from "../lib/database";

export async function createUserRepo(firstName: string, lastName: string, email: string, password: string) {

  try {
    const pgPool = getPgPool()

    const result = await pgPool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ($1,$2,$3,$4)
       RETURNING id, first_name`,
      [firstName, lastName, email, password]
    )

    return result.rows[0]
  } catch (error) {
    throw error;
  }

}
