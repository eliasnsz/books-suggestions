import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const alreadyIsInSoonPage = new URL(request.url).pathname === "/soon";

  if (!alreadyIsInSoonPage && process.env.NODE_ENV === "production") {
    return NextResponse.redirect(new URL("/soon", request.url));
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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
