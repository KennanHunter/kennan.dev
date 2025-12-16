CREATE TABLE user(
    discord_client_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    last_login INTEGER,
    invited_at INTEGER,
    invited_by TEXT
);

CREATE TABLE permission_group (
    name TEXT PRIMARY KEY,
    description TEXT,
    created_at INTEGER,
    created_by TEXT
);

CREATE TABLE user_permission_group (
    user_discord_client_id TEXT REFERENCES user(discord_client_id) ON DELETE CASCADE,
    permission_group_name TEXT REFERENCES permission_group (name) ON DELETE CASCADE,
    PRIMARY KEY (
        user_discord_client_id,
        permission_group_name
    )
);