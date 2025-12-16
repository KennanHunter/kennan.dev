CREATE TABLE users (
    username TEXT PRIMARY KEY,
    last_login INTEGER,
    invited_at INTEGER,
    invited_by TEXT
);

CREATE TABLE user_discord_accounts (
    user_username TEXT REFERENCES users(username) ON DELETE CASCADE,
    discord_client_id TEXT,
    bound_by TEXT NOT NULL,
    bound_at INTEGER NOT NULL,
    PRIMARY KEY (user_username)
);

CREATE TABLE discord_accounts (
    discord_client_id TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    linked_at INTEGER NOT NULL
);

CREATE TABLE permission_groups (
    name TEXT PRIMARY KEY,
    description TEXT,
    created_at INTEGER,
    created_by TEXT
);

CREATE TABLE user_permission_groups (
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    permission_group_name TEXT REFERENCES permission_groups(name) ON DELETE CASCADE,
    PRIMARY KEY (
        username,
        permission_group_name
    )
);