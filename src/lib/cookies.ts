import { cookies } from "next/headers";
import { globalConfig } from "@/config/config";

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

export async function getCookieId() {
  try {

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_id");
    const sessionId = sessionCookie?.value;

    if (!sessionId) throw new Error(`No session cookie was found`);
    return cookieStore;
  } catch (error) {
    throw error;
  }
}

export async function deleteCookie() {
  try {
    const cookieStore = await getCookieId()

  } catch (error) {
    throw error;
  }
}
