import type { NextRequest } from "next/server";
import { JsonWebTokenError } from "jsonwebtoken";

import { UnauthorizedError } from "@/errors";
import google from "./google";
import user from "./user";
import jwt from "./jwt";

async function authenticateWithGoogle(code: string) {
  const userDataFromGoogle = await google.getGoogleUserFromCode(code);

  const userFoundOrCreated = await user.findOrCreateFromGoogle({
    google_id: userDataFromGoogle.id,
    email: userDataFromGoogle.email,
    firstName: userDataFromGoogle.given_name,
    lastName: userDataFromGoogle.family_name,
    profileImageUrl: userDataFromGoogle.picture,
  });

  const token = jwt.generateJsonWebToken(
    {},
    {
      subject: userFoundOrCreated.id,
    },
  );

  return token;
}

async function getAuthenticatedUserFromRequest(request: NextRequest) {
  const token = request.cookies.get("access_token");

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    const decrypted = jwt.verifyToken(token.value);
    const userId = decrypted.sub as string;

    return await user.findOneById(userId);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError({
        message: "Seu token de autenticação é inválido ou expirou.",
        action: "Faça login novamente para obter um novo token.",
      });
    }

    throw error;
  }
}

export default Object.freeze({
  authenticateWithGoogle,
  getAuthenticatedUserFromRequest,
});
