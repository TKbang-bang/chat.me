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
        (u.username ILIKE '%' || $1 || '%'
        OR u.first_name ILIKE '%' || $1 || '%'
        OR u.last_name ILIKE '%' || $1 || '%')
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

  const query2 = await pool.query(
    `
    WITH users_search AS (
    SELECT
        u.id,
        u.username,
        up.picture,
        c.id AS chat_id
    FROM users u
    LEFT JOIN user_profiles up 
        ON u.id = up.user_id

    /* detectar chat directo entre ambos */
    LEFT JOIN chats c 
        ON c.type = 'direct'

    LEFT JOIN chat_participants cp1 
        ON cp1.chat_id = c.id 
        AND cp1.user_id = $2

    LEFT JOIN chat_participants cp2 
        ON cp2.chat_id = c.id 
        AND cp2.user_id = u.id

    WHERE
        (
            u.username ILIKE '%' || $1 || '%'
            OR u.first_name ILIKE '%' || $1 || '%'
            OR u.last_name ILIKE '%' || $1 || '%'
        )
        AND (cp1.chat_id = cp2.chat_id OR c.id IS NULL)
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
        cp.chat_id
    FROM chat_participants cp
    WHERE cp.user_id = $2
)

/* RESULTADO FINAL */

SELECT
    us.id AS id,
    us.username AS name,
    us.picture AS picture,
    us.chat_id AS chat_id,
    'user' AS type,
    CASE
        WHEN us.chat_id IS NOT NULL THEN true
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
FROM groups_search gs;`,
    [search, userId],
  );

  return searchResult.rows;
};
