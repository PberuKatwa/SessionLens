import { Pool } from "pg";
import { postgresEnv } from "../config/config";

let pool:Pool

export function getPgPool() {
  try {
    const { pgHost, pgDatabase, pgPassword, pgPort, pgUser } = postgresEnv();

    if (!pool) {
      pool = new Pool({
        user: pgUser,
        host: pgHost,
        database: pgDatabase,
        password: pgPassword,
        port: Number(pgPort),
      })
    }

    return pool;
  } catch (error) {
    throw error;
  }
}
