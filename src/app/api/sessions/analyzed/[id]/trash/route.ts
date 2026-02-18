import { logger } from "@/lib/logger";
import { trashAnalyzedSession } from "@/repositories/analyzedSessions.repository";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";

async function trashSession(
  req: NextRequest,
  session: BaseAuthSession,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;

    if (isNaN(id))
      return NextResponse.json({ success:false, message: "Invalid ID" }, { status: 400 });

    await trashAnalyzedSession(id);
    const response: ApiResponse = {
      success: true,
      message: "Successfully trashed analyzed session"
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("error trashing analyzed session", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(trashSession);
