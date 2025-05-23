import { NextResponse, type NextRequest } from "next/server";

import {
  withAuthentication,
  withAuthorization,
  withErrorHandler,
} from "@/infra/controller";

async function getHandler(request: NextRequest, context) {
  const user = context.user;

  return NextResponse.json(user, { status: 200 });
}

export const GET = withErrorHandler(
  withAuthentication(withAuthorization(getHandler, "read:session")),
);
