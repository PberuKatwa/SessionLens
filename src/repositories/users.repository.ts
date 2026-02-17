import { AuthUser, BaseUser, CreateUserPayload } from "@/types/user.types";
import * as bcrypt from "bcrypt";
import { getPgPool } from "../lib/database";
import { logger } from "@/lib/logger";

export async function createUser(payload:CreateUserPayload):Promise<BaseUser> {

  try {
    const pgPool = getPgPool()
    const { firstName, lastName, email, password } = payload;

    logger.warn(`Atttempting to create user with name:${firstName}.`);
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pgPool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ($1,$2,$3,$4)
       RETURNING first_name`,
      [firstName, lastName, email, hashedPassword]
    );

    const user: BaseUser = result.rows[0];
    logger.info(`Successfully created user`);

    return user;
  } catch (error) {
    throw error;
  }
}

export async function findUserByEmail(email: string):Promise<AuthUser> {
  try {
    const pgPool = getPgPool();
    const result = await pgPool.query(
      `SELECT id, first_name, email FROM users WHERE email = $1`,
      [email]
    );
    const user = result.rows[0];
    return user;
  } catch (error) {
    throw error;
  }

}
