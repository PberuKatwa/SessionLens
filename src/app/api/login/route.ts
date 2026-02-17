import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validatePassword } from "../../../repositories/users.repository";
import { createSession } from "../../../repositories/sessions.repository";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await validatePassword(email, password);

    const sessionId = await createSession(user.id);

    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return Response.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `${error.message}` }, { status: 500 });
  }

}
