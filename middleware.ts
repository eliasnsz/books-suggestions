import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const alreadyIsInDevelopmentPage =
    new URL(request.url).pathname === "/under-development";

  if (!alreadyIsInDevelopmentPage && process.env.VERCEL_ENV === "production") {
    return NextResponse.redirect(new URL("/under-development", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|status|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
