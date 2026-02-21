import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth.middleware";
import { BaseAuthSession } from "@/types/authSession.types";
import {
  BaseFellowApiResponse,
  PaginatedFellowApiResponse,
  CreateFellowPayload
} from "@/types/fellows.types";
import {
  createFellow,
  getAllFellows
} from "../../../repositories/fellows.repository";

async function getAllFellowsHandler(
  req: NextRequest,
  session: BaseAuthSession
) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getAllFellows(page, limit);

    const response: PaginatedFellowApiResponse = {
      success: true,
      message: "Successfully fetched fellows",
      data: result
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {

    logger.error("Error fetching fellows", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


async function createFellowHandler(
  req: NextRequest,
  session: BaseAuthSession
) {
  try {
    const body: CreateFellowPayload = await req.json();

    const result = await createFellow(body);

    const response: BaseFellowApiResponse = {
      success: true,
      message: "Fellow created successfully",
      data: result
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error: any) {

    logger.error("Error creating fellow", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export const GET = authMiddleware(getAllFellowsHandler);
export const POST = authMiddleware(createFellowHandler);
