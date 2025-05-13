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
export default Object.freeze({
  generateJsonWebToken,
});
