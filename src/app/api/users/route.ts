import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";

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

    const user = await registerUser({
      firstName,
      lastName,
      email,
      password,
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error:any) {
    console.error(error);
    return NextResponse.json(
      { message: `${error.message}` },
      { status: 500 }
    );
  }
}
