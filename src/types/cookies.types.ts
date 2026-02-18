import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface BaseCookie {
  cookieStore: ReadonlyRequestCookies;
  authSessionId: string;
}

export type AuthCookieId = string;
