type GoogleUserProfileData = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

const fetchAccessTokenFromGoogleUrl = "https://oauth2.googleapis.com/token";
const fetchUserFromGoogleUrl = "https://www.googleapis.com/oauth2/v1/userinfo";

async function getGoogleUserFromCode(code: string) {
  const token = await exchangeCodeForAccessToken(code);
  const userInfo = await fetchGoogleUserInfo(token);

  return userInfo;

  async function exchangeCodeForAccessToken(code: string) {
    const payload = {
      code: code,
      grant_type: "authorization_code",
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    };

    const accessTokenRequest = await fetch(fetchAccessTokenFromGoogleUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await accessTokenRequest.json();
    const accessToken: string = data.access_token;

    return accessToken;
  }

  async function fetchGoogleUserInfo(accessToken: string) {
    const headers = new Headers({
      Authorization: `Bearer ${accessToken}`,
    });

    const googleUserProfileResponse = await fetch(fetchUserFromGoogleUrl, {
      headers,
    });

    const userData: GoogleUserProfileData =
      await googleUserProfileResponse.json();

    return userData;
  }
}

export default Object.freeze({
  getGoogleUserFromCode,
});
