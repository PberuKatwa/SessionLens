import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";
import { logger } from "@/lib/logger";
import { UserApiResponse } from "@/types/user.types";

export async function POST(req: NextRequest) {
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
