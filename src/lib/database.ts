import { Pool } from "pg";
let pool:Pool

export async function getPgPool() {
  try {
    const { postgresEnv } = await import("../config/config");
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
