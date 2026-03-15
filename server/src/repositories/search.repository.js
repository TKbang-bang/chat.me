import pool from "../db/pool.js";

export const searchRepository = async (search, userId) => {
  const searchResult = await pool.query(
    `
    WITH users_search AS (
        SELECT
            u.id,
            u.username,
            up.picture,
            (
                SELECT c.id
                FROM chats c
                JOIN chat_participants cp1 ON cp1.chat_id = c.id AND cp1.user_id = u.id
                JOIN chat_participants cp2 ON cp2.chat_id = c.id AND cp2.user_id = $2
                WHERE c.type = 'direct'
                LIMIT 1
            ) AS chat_id
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE
            (
                u.username ILIKE '%' || $1 || '%'
                OR u.first_name ILIKE '%' || $1 || '%'
                OR u.last_name ILIKE '%' || $1 || '%'
            )
            AND u.id != $2
                ),
        groups_search AS (
            SELECT
                gp.chat_id,
                gp.name,
                gp.picture
            FROM group_details gp
            WHERE gp.name ILIKE '%' || $1 || '%'
        ),
    my_chats AS (
        SELECT
            cp.chat_id,
            c.type
        FROM chat_participants cp
        LEFT JOIN chats c ON cp.chat_id = c.id
        WHERE cp.user_id = $2
    ),
    my_blocked_users AS (
        SELECT
            blocked_user_id
        FROM users_blocked
        WHERE user_id = $2
    ),
    my_users_requests AS(
        SELECT
            receiver_id
        FROM users_chat_requests
        WHERE sender_id = $2
    ),
    my_groups_requests AS(
        SELECT
            chat_id
        FROM groups_chat_requests
        WHERE sender_id = $2
    )
    SELECT
        us.id,
        us.username AS name,
        us.picture,
        us.chat_id,
        'direct' AS type,
        CASE
            WHEN us.chat_id IN (SELECT chat_id FROM my_chats) THEN true
            ELSE false
        END AS is_in_chat,
        CASE
            WHEN us.id IN (SELECT receiver_id FROM my_users_requests) THEN true
            ELSE false
        END AS has_sent_request,
        CASE
            WHEN EXISTS (
                SELECT
                    mb.blocked_user_id
                FROM my_blocked_users mb
                WHERE mb.blocked_user_id = us.id )
            THEN true
            ELSE false
        END AS is_blocked
    FROM users_search us

    UNION ALL

    SELECT
        gs.chat_id AS id,
        gs.name AS name,
        gs.picture AS picture,
        gs.chat_id AS chat_id,
        'group' AS type,
        CASE
            WHEN gs.chat_id IN (SELECT chat_id FROM my_chats) THEN true
            ELSE false
        END AS is_in_chat,
        CASE
            WHEN gs.chat_id IN (SELECT chat_id FROM my_groups_requests) THEN true
            ELSE false
        END AS has_sent_request,
        false::BOOLEAN AS is_blocked
    FROM groups_search gs;
    `,
    [search, userId],
  );

  return searchResult.rows;
};
