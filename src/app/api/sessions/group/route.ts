import { logger } from "@/lib/logger";
import { createGroupSession, getAllGroupSessions, getGroupSessionById } from "@/repositories/groupSessions.repository";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { CompleteGroupSessionApiResponse, PaginatedGroupSessionsApiResponse, SingleGroupSessionApiResponse } from "@/types/groupSession.types";
import { GroupSessionTranscript } from "@/types/json.types";
import { NextRequest, NextResponse } from "next/server";
import { parseJsonFile } from "@/lib/json.manager";
import { authMiddleware } from "@/lib/auth.middleware";


async function createSession(req: NextRequest, session:BaseAuthSession) {
  try {

    const formData = await req.formData();

    const fellowName = formData.get("fellowName") as string;
    const groupId = formData.get("groupId") as string;
    const transcriptFile = formData.get("transcriptFile") as File;

    const parsedJson = await parseJsonFile<GroupSessionTranscript>(transcriptFile)

    const groupSession = await createGroupSession({
      user_id: session.user_id,
      group_id: parseInt(groupId),
      fellow_name: fellowName,
      transcript: parsedJson
    });

    const response: SingleGroupSessionApiResponse = {
      success: true,
      message: "Successfully created group session",
      data:groupSession
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {

    logger.error(`error in creating group session`, error);
    const response: ApiResponse = {
      success: false,
      message:`${error.message}`
    }
    return NextResponse.json(response, { status: 500 });
  }
}

async function getAllSessions(
  req: NextRequest,
  session: BaseAuthSession
) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getAllGroupSessions(page, limit);

    const response: PaginatedGroupSessionsApiResponse = {
      success: true,
      message: "Successfully fetched sessions",
      data: result,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    logger.error("error in fetching group sessions", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(createSession);
export const GET = authMiddleware(getAllSessions);
