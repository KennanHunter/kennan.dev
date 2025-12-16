import { AppContext } from "../..";

export const get_discord_oauth_callback_url = (c: AppContext) => {
  console.log(
    "Determining Discord OAuth callback URL for environment:",
    c.env.ENVIRONMENT,
  );

  return {
    production: "https://cms.kennan.dev/auth/callback" as const,
    dev: "https://localhost:8787/auth/callback" as const,
  }[c.env.ENVIRONMENT];
};

export const get_access_token_for_account_id = async (
  c: AppContext,
  discordClientId: String,
): Promise<string | undefined> => {
  const res = await c.env.content_db
    .prepare(
      "SELECT access_token FROM discord_accounts WHERE discord_client_id = ?",
    )
    .bind(discordClientId)
    .first<{ access_token: string }>();

  return res?.access_token;
};

export const get_refresh_and_access_for_oauth_code = async (
  c: AppContext,
  code: string,
): Promise<
  | {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      scope: string;
    }
  | undefined
> => {
  try {
    let redirect_uri = get_discord_oauth_callback_url(c);

    console.log("Using redirect URI:", redirect_uri);

    const body = new URLSearchParams({
      client_id: c.env.CLIENT_ID,
      client_secret: c.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri,
    });

    const res = await fetch(`https://discord.com/api/v10/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      console.error("Failed to exchange code for tokens:", await res.text());
      return undefined;
    }

    const tokenData = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      scope: string;
    };

    return tokenData;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return undefined;
  }
};

export const get_access_token_for_refresh = async (
  c: AppContext,
  refresh_token: string,
): Promise<string | undefined> => {
  try {
    const body = new URLSearchParams({
      client_id: c.env.CLIENT_ID,
      client_secret: c.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    });

    const res = await fetch(`https://discord.com/api/v10/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      console.error("Failed to refresh token:", await res.text());
      return undefined;
    }

    const tokenData = (await res.json()) as { access_token: string };

    return tokenData.access_token;
  } catch (error) {
    console.error("Error refreshing Discord access token:", error);
    return undefined;
  }
};

export const get_info_for_access_token = async (
  c: AppContext,
  access_token: string,
): Promise<DiscordOAuth2Info | undefined> => {
  try {
    const res = await fetch(`https://discord.com/api/v10/oauth2/@me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // TODO: type check?
    const parsed_info = (await res.json()) as DiscordOAuth2Info;

    console.log("Fetched Discord user info:", parsed_info);

    if (!parsed_info.user.id) {
      // closest thing to a check for error case
      return undefined;
    }

    return parsed_info;
  } catch (error) {
    console.error("Error fetching Discord user info:", error);

    return undefined;
  }
};
