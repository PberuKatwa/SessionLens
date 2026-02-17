import session from "express-session";
import type { RequestHandler } from "express";
import connectPgSimple from "connect-pg-simple";
import { getPgPool } from "./database";
import { globalConfig } from "../config/config";

const PgSession = connectPgSimple(session);

export const createSessionMiddleware = async function (): Promise<RequestHandler> {
  try {

    const pgPool = getPgPool();
    const { sessionName, sessionSecret, environment } = globalConfig();

    let isSecureSession = false
    if (environment === "PRODUCTION") isSecureSession = true;

    const sessionMiddleware = session({

      store: new PgSession({
        pgPool,
        tableName: sessionName,
      }),

      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isSecureSession,
        maxAge: 1000 * 60 * 60 * 24,
      },

    });

    return sessionMiddleware;
  } catch (error) {
    throw error;
  }
}
