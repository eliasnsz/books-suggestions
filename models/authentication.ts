import jwt from "./jwt";
import user from "./user";
import google from "./google";

async function withGoogle(code: string) {
  const userDataFromGoogle = await google.getGoogleUserFromCode(code);

  const userFromGoogle = await user.findOrCreateFromGoogle({
    google_id: userDataFromGoogle.id,
    email: userDataFromGoogle.email,
    firstName: userDataFromGoogle.given_name,
    lastName: userDataFromGoogle.family_name,
    profileImageUrl: userDataFromGoogle.picture,
  });

  const payload = {
    email: userFromGoogle.email,
    first_name: userFromGoogle.first_name,
    last_name: userFromGoogle.last_name,
    profile_image_url: userFromGoogle.profile_image_url,
    created_at: userFromGoogle.created_at,
  };

  const token = jwt.generateJsonWebToken(payload, {
    subject: userFromGoogle.id,
  });

  return token;
}

export default Object.freeze({
  withGoogle,
});
