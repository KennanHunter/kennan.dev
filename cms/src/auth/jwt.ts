import * as jose from "jose";
import { AppContext } from "..";

export const createJwtForUser = async (
  c: AppContext,
  username: string,
): Promise<string> => {
  const secret = new TextEncoder().encode(c.env.JWT_SECRET_KEY);

  const alg = "HS256";

  const jwt = await new jose.SignJWT({ username })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);

  return jwt;
};

export const verifyJwt = async (
  c: AppContext,
  token: string,
): Promise<{ username: string } | undefined> => {
  const secret = new TextEncoder().encode(c.env.JWT_SECRET_KEY);

  try {
    const { payload } = await jose.jwtVerify(token, secret);

    if (typeof payload.username === "string") {
      return { username: payload.username };
    } else {
      return undefined;
    }
  } catch (e) {
    console.error("JWT verification failed:", e);
    return undefined;
  }
};
