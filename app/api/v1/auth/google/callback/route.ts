import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import authentication from "models/authentication";
import { withErrorHandler } from "infra/controller";

async function getHandler(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const accessToken = await authentication.withGoogle(code);

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken);

  return NextResponse.redirect(new URL("/", request.url));
}

export const GET = withErrorHandler(getHandler);
