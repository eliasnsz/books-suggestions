import jwt, { type SignOptions } from "jsonwebtoken";

function generateJsonWebToken(
  payload: string | Buffer | object,
  options?: SignOptions,
) {
  const defaultSignInOptions: SignOptions = {
    expiresIn: "1h",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    ...defaultSignInOptions,
    ...options,
  });

  return token;
}

function verifyToken(token: string) {
  const decrypted = jwt.verify(token, process.env.JWT_SECRET);
  return decrypted;
}

export default Object.freeze({
  generateJsonWebToken,
  verifyToken,
});
