import { logger } from "@/lib/logger";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";


async function createGroupSession(req: NextRequest) {
  try {

  } catch (error: any) {

    logger.error(`error in creating group session`, error);
    const response: ApiResponse = {
      success: false,
      message:`${error.message}`
    }
    return NextResponse.json(response, { status: 500 });
  }
}
