// lib/session.ts
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { getPgPool } from "./database";
import { globalConfig } from "../config/config";

const PgSession = connectPgSimple(session);

export const createSessionMiddleware = async function () {
  try {

    const pgPool = getPgPool();
    const { sessionName } = globalConfig();

    const sessionMiddleware = session({
      store: new PgSession({
        pgPool,
        tableName: sessionName,
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    });


  } catch (error) {
    throw error;
  }
}

export
