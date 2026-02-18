import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types/api.types";
import { BaseAuthSession } from "@/types/authSession.types";
import { NextRequest, NextResponse } from "next/server";


async function createGroupSession(req: NextRequest, session:BaseAuthSession) {
  try {

    const formData = await req.formData();

    const fellowName = formData.get("fellowName") as string;
    const groupId = formData.get("groupId") as string;
    const transcriptFile = formData.get("transcriptFile") as File;

    if (!transcriptFile || !fellowName || !groupId) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    if (transcriptFile.type !== "application/json" && !transcriptFile.name.endsWith('.json')) {
      return NextResponse.json({ error: "File must be a valid JSON" }, { status: 400 });
    }

  } catch (error: any) {

    logger.error(`error in creating group session`, error);
    const response: ApiResponse = {
      success: false,
      message:`${error.message}`
    }
    return NextResponse.json(response, { status: 500 });
  }
}
