import * as jose from "jose"

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY),
}

export const validateJwt = async(tokenAuth: string) => {

  let token = "";

  if (tokenAuth) {
    try {

      if (tokenAuth.startsWith("Bearer")) {
        token = tokenAuth.slice(7, tokenAuth.length);
      }

      const decoded = await jose.jwtVerify(token, jwtConfig.secret);

      if (decoded.payload?.id) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("isAuthenticated error: ", err);

      return false;
    }
  } else {
    return false;
  }
}

export const validateSessionJwt = async(token: string) => {

  try {

    const decoded = await jose.jwtVerify(token, jwtConfig.secret);

    if (decoded.payload?.id) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("isAuthenticated error: ", err);
    return false;
  }

}

export const readSessionJwt = async(token: string) => {

  try {

    const decoded = await jose.jwtVerify(token, jwtConfig.secret);
    return decoded;
    
  } catch (err) {
    console.error("isAuthenticated error: ", err);
    return null;
  }

}