import { createMiddleware } from "hono/factory";
import { verifyJwt } from "../auth/jwt";
import { get_groups_for_user } from "../db";

export const parseJwtIfPresent = createMiddleware(async (c, next) => {
  const auth_header = c.req.header("Authorization")?.split(" ");

  if (!auth_header) {
    return next();
  }

  if (auth_header[0] != "Bearer") {
    return next();
  }

  if (auth_header[0] == "Bearer") {
    const username = await verifyJwt(c, auth_header[1]);

    c.set("jwt_username", username?.username);

    return next();
  }
});

export const requireUserInGroup = (group: string) =>
  createMiddleware(async (c, next) => {
    let username = c.get("jwt_username") as string | undefined;

    if (!username) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user_groups = await get_groups_for_user(c, username);

    if (!user_groups || !user_groups.includes(group)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    return next();
  });
