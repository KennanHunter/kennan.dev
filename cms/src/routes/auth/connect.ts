import { AppContext } from "../..";
import { get_discord_oauth_callback_url } from "../../auth/discord";

export const redirect_to_discord_oauth = (c: AppContext) => {
  const callback = encodeURIComponent(get_discord_oauth_callback_url(c));

  const discord_oauth_url = `https://discord.com/oauth2/authorize?client_id=${c.env.CLIENT_ID}&response_type=code&redirect_uri=${callback}&scope=identify`;

  return c.redirect(discord_oauth_url);
};
