import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { BaseAuthSession } from "@/types/authSession.types";
import {
  CompleteFellowApiResponse
} from "@/types/fellows.types";
import {
  getFellowById,
  trashFellow
} from "@/repositories/fellows.repository";

async function getFellowByIdHandler(
  req: NextRequest,
  session: BaseAuthSession,
  { params }: { params: { id: number } }
) {
  try {

    const { id } = await params;

    const result = await getFellowById(id);

    const response: CompleteFellowApiResponse = {
      success: true,
      message: "Successfully fetched fellow",
      data: result
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("Error fetching fellow", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

async function trashFellowHandler(
  req: NextRequest,
  session: BaseAuthSession,
  { params }: { params: { id: number } }
) {
  try {

    const { id } = await params;

    await trashFellow(id);

    return NextResponse.json(
      { success: true, message: "Fellow trashed successfully" },
      { status: 200 }
    );

  } catch (error: any) {

    logger.error("Error trashing fellow", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export const GET = authMiddleware(getFellowByIdHandler);
export const DELETE = authMiddleware(trashFellowHandler);
