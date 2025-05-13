import { NextResponse } from "next/server";

export async function GET() {
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
