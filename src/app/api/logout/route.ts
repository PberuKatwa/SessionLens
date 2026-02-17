import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {

    const cookieStore = await cookies();

    cookieStore.delete("session_id");
    logger.info(`Succesfully logged out user`)

    return NextResponse.json({ message: "Logged out" });
  } catch (error:any) {
    logger.error(`Error in logging out`, error)
    return NextResponse.json({ success: false, message: `${error.message}` }, { status: 500 });
  }
}
