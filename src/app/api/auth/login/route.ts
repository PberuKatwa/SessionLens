import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validatePassword } from "../../../../repositories/users.repository";
import { createSession } from "../../../../repositories/sessions.repository";
import { globalConfig } from "@/config/config";
import { AuthUserApiResponse } from "@/types/user.types";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const { environment } = globalConfig();

    const user = await validatePassword(email, password);
    const sessionId = await createSession(user.id);
    console.log("session Id", sessionId)

    const cookieStore = await cookies();

    let isSecure = false;
    if (environment === "PRODUCTION") isSecure = true;

    cookieStore.set("session_id", sessionId.id, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
    });

    const response: AuthUserApiResponse = {
      success: true,
      message: "Successfully logged in user",
      data:user
    }

    return Response.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `${error.message}` }, { status: 500 });
  }

}
