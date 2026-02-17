import { AuthUser, BaseUser, CreateUserPayload, UserProfile } from "@/types/user.types";
import * as bcrypt from "bcrypt";
import { getPgPool } from "../lib/database";
import { logger } from "@/lib/logger";

export async function createUser(payload:CreateUserPayload):Promise<BaseUser> {
  try {
    const pgPool = getPgPool()
    const { firstName, lastName, email, password } = payload;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new Error("Password is too weak. It must be at least 8 characters and include uppercase, lowercase, and numbers.");
    }

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

export async function findUserByEmail(email: string):Promise<UserProfile> {
  try {
    const pgPool = getPgPool();
    const result = await pgPool.query(
      `SELECT id, first_name, last_name FROM users WHERE email = $1`,
      [email]
    );
    const user:UserProfile = result.rows[0];
    return user;
  } catch (error) {
    throw error;
  }

}

export async function validatePassword(email: string, password: string):Promise<AuthUser> {
  try {
    logger.warn(`Attempting to login user`);
    const pgPool = getPgPool();

    const result = await pgPool.query(
      `SELECT id,email, password FROM users WHERE email=$1;`,
      [email]
    )

    const user: AuthUser = result.rows[0];
    if (!user.password || !password) throw new Error(`The user didnt provide a password`);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error(`Email or password provided is invalid`);

    logger.info(`Successfully logged in`);
    return user;
  } catch (error) {
    throw error;
  }
}
