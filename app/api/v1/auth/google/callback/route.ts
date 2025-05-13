import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import authentication from "models/authentication";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const accessToken = await authentication.withGoogle(code);

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken);

  return NextResponse.redirect(new URL("/", request.url));
}
