import jwt, { JwtPayload } from "jsonwebtoken";

export function generateToken(payload: JwtPayload) {
  const token = jwt.sign(payload, String(process.env.NEXT_PUBLIC_JWT_SECRET_KEY), { expiresIn: "365d" });
  return token;
}

export function validateJwt(token: string) {
  try {
    console.log("recibi");
    console.log(token);
    const decoded = jwt.verify(token, String(process.env.NEXT_PUBLIC_JWT_SECRET_KEY));
    console.log(decoded);
    return decoded as JwtPayload;
  } catch (error) {
    console.log("error validando");
    console.error(error);
  }
}