import pool from "../db/pool.js";

export const searchRepository = async (search, userId) => {
  const searchResult = await pool.query(
    `
    WITH users_search AS (
        SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.username,
        up.picture,
        c.id AS chat_id
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    LEFT JOIN chats c ON c.type = 'direct'
        AND c.id IN (
            SELECT chat_id
            FROM chat_participants
            WHERE user_id = u.id
        )
    WHERE
        u.username ILIKE '%' || $1 || '%'
        OR u.first_name ILIKE '%' || $1 || '%'
        OR u.last_name ILIKE '%' || $1 || '%'
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
)
SELECT
    us.id AS id,
    us.username AS name,
    us.picture AS picture,
    us.chat_id AS chat_id,
    'user' AS type,
    CASE
        WHEN us.chat_id IN (SELECT chat_id FROM my_chats) THEN true
        ELSE false
    END AS is_in_chat
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
    END AS is_in_chat
FROM groups_search gs;
    `,
    [search, userId],
  );

  return searchResult.rows;
};
