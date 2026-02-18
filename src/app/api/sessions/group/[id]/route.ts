import { logger } from "@/lib/logger";
import { createGroupSession, getGroupSessionById } from "@/repositories/groupSessions.repository";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { CompleteGroupSessionApiResponse, SingleGroupSessionApiResponse } from "@/types/groupSession.types";
import { NextRequest, NextResponse } from "next/server";
import { parseJsonFile } from "@/lib/json.manager";
import { authMiddleware } from "@/lib/auth.middleware";

async function getSession(
  req: NextRequest,
  session:BaseAuthSession,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;

    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    const session = await getGroupSessionById(id);

    const response: CompleteGroupSessionApiResponse = {
      success: true,
      message: "Successfully fetched response",
      data:session
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error:any) {

    logger.error(`error in fetching group session`, error);
    const response: ApiResponse = {
      success: false,
      message:`${error.message}`
    }
    return NextResponse.json(response, { status: 500 });
  }
}

export const GET = authMiddleware(getSession);
