import { type NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";

const router = createEdgeRouter<NextRequest, { params?: unknown }>();

router.get(getHandler);

async function getHandler() {
  const authUrl = await generateGoogleAuthUrl();
  return NextResponse.redirect(authUrl);

  async function generateGoogleAuthUrl() {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    const scope = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "); // space-delimited list of scopes

    const params = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      scope: scope,
      response_type: "code",
    };

    for (const param in params) {
      const value = params[param];
      authUrl.searchParams.append(param, value);
    }

    return authUrl;
  }
}

async function handler(request: NextRequest, ctx: { params?: unknown }) {
  return router.run(request, ctx) as Promise<NextResponse<unknown>>;
}

export { handler as GET };
