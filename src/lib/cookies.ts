import { cookies } from "next/headers";
import { BaseCookie } from "@/types/cookies.types";

export async function setCookies(authSessionId: string) {
  try {
    const { globalConfig } = await import("../config/config");
    const { cookieIdName, environment } = globalConfig();

    const cookieStore = await cookies();
    let isSecure = false;
    if (environment === "PRODUCTION") isSecure = true;

    cookieStore.set(cookieIdName, authSessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecure,
      path: '/',
      maxAge:86400
    })

  } catch (error) {
    throw error;
  }
}

export async function getCookieId():Promise<BaseCookie> {
  try {

    const { globalConfig } = await import("../config/config");
    const { cookieIdName } = globalConfig();

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(cookieIdName);
    const authSessionId = sessionCookie?.value;

    if (!authSessionId) throw new Error(`No session cookie was found`);
    return { cookieStore, authSessionId };
  } catch (error) {
    throw error;
  }
}

export async function deleteCookie():Promise<string> {
  try {
    const { globalConfig } = await import("../config/config");
    const { cookieIdName } = globalConfig();
    const { cookieStore, authSessionId } = await getCookieId()
    cookieStore.delete(cookieIdName);

    return authSessionId;
  } catch (error) {
    throw error;
  }
}
