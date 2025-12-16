import { AppContext } from "../..";
import {
  get_info_for_access_token,
  get_refresh_and_access_for_oauth_code,
} from "../../auth/discord";
import { createJwtForUser } from "../../auth/jwt";
import { get_user_by_discord_client_id } from "../../db";

export const discord_auth_callback_handler = async (c: AppContext) => {
  const oauth_code = c.req.query("code");

  console.log("Received OAuth2 code:", oauth_code);

  if (!oauth_code) {
    return c.json({ error: "Missing code parameter" }, 400);
  }

  const token_data = await get_refresh_and_access_for_oauth_code(c, oauth_code);

  if (!token_data) {
    return c.json({ error: "Failed to obtain access token" }, 400);
  }

  let info = await get_info_for_access_token(c, token_data.access_token);

  if (!info) {
    return c.json({ error: "Invalid access token" }, 400);
  }

  await c.env.content_db
    .prepare(
      "INSERT INTO discord_accounts (discord_client_id, access_token, refresh_token, linked_at) \
      VALUES (?, ?, ?, ?) ON CONFLICT(discord_client_id) \
      DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token, linked_at = excluded.linked_at",
    )
    .bind(
      info.user.id,
      token_data.access_token,
      token_data.refresh_token,
      Date.now(),
    )
    .run();

  let user = await get_user_by_discord_client_id(c, info.user.id);

  const uri = {
    production: "https://kennan.dev",
    dev: "http://localhost:4321",
  }[c.env.ENVIRONMENT];

  if (user !== null) {
    let access_token = await createJwtForUser(c, user.username);

    const params = new URLSearchParams({
      username: user.username,
      access_token: access_token,
      image_uri: info.user.avatar
        ? `https://cdn.discordapp.com/avatars/${info.user.id}/${info.user.avatar}.png`
        : "",
    });

    return c.redirect(`${uri}/login/success?${params.toString()}`);
  } else {
    return c.redirect(`${uri}/login/no_account`);
  }
};
