import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerUser } from "@/services/auth.service";
import { logger } from "@/lib/logger";
import { ProfileApiResponse, UserApiResponse } from "@/types/user.types";
import { getAuthSession } from "@/repositories/sessions.repository";
import { findUserById } from "../../../../repositories/users.repository";
import { authMiddleware } from "@/lib/auth.middleware";

async function getProfile() {
  try {

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_id");
    const authSessionId = sessionCookie?.value;

    if (!authSessionId) return NextResponse.json({ error: "No session found" }, { status: 401 });

    const authSession = await getAuthSession(authSessionId);
    const user = await findUserById(authSession.user_id);

    const response: ProfileApiResponse = {
      success: true,
      message: "Successfully fetched profile",
      data:user
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {

    logger.error(`Error in fetching user`, error)
    return NextResponse.json({ message: `${error.message}` }, { status: 500 });
  };
}

async function createUser(req: NextRequest) {
  try {

    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await registerUser({ firstName, lastName, email, password });

    const response: UserApiResponse = {
      success: true,
      message: "Successfully registered user",
      data:user
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {

    logger.error(`Error in creating user`, error)
    return NextResponse.json({ message: `${error.message}` }, { status: 500 });
  }
}

export const GET = authMiddleware(getProfile);
export const POST = authMiddleware(createUser);
