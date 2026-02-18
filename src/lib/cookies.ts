import { cookies } from "next/headers";
import { globalConfig } from "@/config/config";
import { BaseCookie } from "@/types/cookies.types";

const { cookieIdName, environment } = globalConfig();

// function cookieConfig() {
//   try {
//     const cookieStore
//   } catch (error) {
//     throw error;
//   }
// }

export async function setCookies(authSessionId: string) {
  try {

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
    const { cookieStore, authSessionId } = await getCookieId()
    cookieStore.delete(cookieIdName);

    return authSessionId;
  } catch (error) {
    throw error;
  }
}
