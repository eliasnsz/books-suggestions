import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createEdgeRouter } from "next-connect";

import authentication from "models/authentication";

const router = createEdgeRouter<NextRequest, { params?: unknown }>();

router.get(getHandler);

async function getHandler(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const accessToken = await authentication.withGoogle(code);

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken);

  return NextResponse.redirect(new URL("/", request.url));
}

async function handler(request: NextRequest, ctx: { params?: unknown }) {
  return router.run(request, ctx) as Promise<NextResponse<unknown>>;
}

export { handler as GET };
