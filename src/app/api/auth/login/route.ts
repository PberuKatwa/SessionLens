import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validatePassword } from "../../../../repositories/users.repository";
import { createAuthSession } from "../../../../repositories/sessions.repository";
import { globalConfig } from "@/config/config";
import { AuthUserApiResponse } from "@/types/user.types";
import { setCookies } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await validatePassword(email, password);
    const authSession = await createAuthSession(user.id);
    await setCookies(authSession.id);

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
