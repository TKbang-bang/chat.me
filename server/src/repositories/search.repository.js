import pool from "../db/pool.js";

export const searchRepository = async (search) => {
  const searchResult = await pool.query(
    `
    WITH users_search AS (
        SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.username,
            up.picture
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE 
            u.username ILIKE '%' || $1 || '%' 
            OR u.first_name ILIKE '%' || $1 || '%' 
            OR u.last_name ILIKE '%' || $1 || '%'
    ),
    groups_search AS (
        SELECT
            chat_id,
            name,
            picture
        FROM group_details 
        WHERE name ILIKE '%' || $1 || '%'
    )
    SELECT
        us.id AS id,
        us.username AS name,
        us.picture AS profile,
        'direct' AS type
    FROM users_search us
    UNION ALL
    SELECT
        gs.chat_id AS id,
        gs.name AS name,
        gs.picture AS profile,
        'group' AS type
    FROM groups_search gs;
    `,
    [search],
  );

  return searchResult.rows;
};
