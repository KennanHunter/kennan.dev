import { AppContext } from "..";

export const get_user_by_discord_client_id = async (
  c: AppContext,
  discordClientId: String,
) => {
  const res = await c.env.content_db
    .prepare(
      `
      SELECT u.username, u.last_login, u.invited_at, u.invited_by
      FROM users u
      JOIN user_discord_accounts uda ON u.username = uda.user_username
      WHERE uda.discord_client_id = ?
    `,
    )
    .bind(discordClientId)
    .first<{
      username: string;
      last_login: number;
      invited_at: number;
      invited_by: string;
    }>();

  return res;
};

export const get_groups_for_user = async (
  c: AppContext,
  username: string,
): Promise<string[]> => {
  const res = await c.env.content_db
    .prepare(
      `
      SELECT g.name
      FROM groups g
      JOIN user_groups ug ON g.name = ug.group_name
      WHERE ug.user_username = ?
    `,
    )
    .bind(username)
    .all<{ name: string }>();

  return res.results.map((r) => r.name);
};
