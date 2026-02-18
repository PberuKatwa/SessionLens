import { cookies } from "next/headers";
import { globalConfig } from "@/config/config";
import { BaseCookie } from "@/types/cookies.types";

export async function setCookies(authSessionId: string) {
  try {

    const cookieStore = await cookies();
    const { environment } = globalConfig();

    let isSecure = false;
    if (environment === "PRODUCTION") isSecure = true;

    cookieStore.set("auth_session_id", authSessionId, {
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

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_id");
    const authSessionId = sessionCookie?.value;

    if (!authSessionId) throw new Error(`No session cookie was found`);
    return { cookieStore, authSessionId };
  } catch (error) {
    throw error;
  }
}

export async function deleteCookie():Promise<string> {
  try {
    const { cookieStore, authSessionId } = await getCookieId()
    cookieStore.delete("auth_session_id");

    return authSessionId;
  } catch (error) {
    throw error;
  }
}
