INSERT INTO users (username) VALUES ('kennan');

INSERT INTO
    permission_groups (
        name,
        description,
        created_at,
        created_by
    )
VALUES (
        'admin',
        'Administrators with full access',
        strftime ('%s', 'now'),
        'kennan'
    );

INSERT INTO
    user_permission_groups (
        username,
        permission_group_name
    )
VALUES ('kennan', 'admin');

INSERT INTO
    user_discord_accounts (
        user_username,
        discord_client_id,
        bound_by,
        bound_at
    )
VALUES (
        'kennan',
        '358710471471136791',
        'kennan',
        strftime ('%s', 'now')
    );