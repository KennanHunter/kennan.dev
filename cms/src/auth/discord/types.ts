type DiscordOAuthScope =
  | "identify"
  | "guilds.join"
  | "activities.write"
  | "applications.builds.read"
  | "applications.builds.upload"
  | "applications.commands"
  | "applications.commands.update"
  | "applications.commands.permissions.update"
  | "applications.entitlements"
  | "applications.store.update"
  | "bot"
  | "connections"
  | "dm_channels.read"
  | "email"
  | "gdm.join"
  | "guilds"
  | "guilds.members.read"
  | "messages.read"
  | "relationships.read"
  | "role_connections.write"
  | "rpc"
  | "rpc.activities.write"
  | "rpc.notifications.read"
  | "rpc.voice.read"
  | "rpc.voice.write"
  | "voice"
  | "webhook.incoming";

type DiscordOAuth2Info = {
  // discord documents this with the ambiguous Field="application"	Type="partial application object"
  application: Partial<{
    id: string;
    name: string;
    icon: string;
    description: string;
    hook: boolean;
    bot_public: boolean;
    bot_require_code_grant: boolean;
    verify_key: string;
  }>;
  scopes: ("identify" | "guilds.join")[];
  expires: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    global_name: string | null;
    public_flags: number;
  };
};
