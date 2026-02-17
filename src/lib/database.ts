import { Pool } from "pg";

let pool:Pool

export function getPgPool() {
  try {

    if (!pool) {
      pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: Number(process.env.PG_PORT),
      })
    }
    return pool;

  } catch (error) {
    throw error;
  }
}
