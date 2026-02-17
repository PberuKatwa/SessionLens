import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/models/init.models";
import { registerUser } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {

    // 1. Ensure DB is ready
    await initDatabase();

    // 2. Parse request body
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Call your service layer
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
