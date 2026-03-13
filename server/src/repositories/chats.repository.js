import pool from "../db/pool.js";

export const getChats = async (userId) => {
  const chats = await pool.query(
    `
        WITH users_in_chat AS (
            SELECT DISTINCT ON (c.id)
                u.id AS ug_id,
                u.username AS name,
                up.picture,
                c.id AS chat_id,
                m.id AS last_message_id,
                m.content AS last_message_content,
                m.sender_id AS last_message_sender,
                u2.username AS last_message_sender_username,
                m.created_at AS last_message_created_at
            FROM users u
            LEFT JOIN user_profiles up ON up.user_id = u.id
            JOIN chat_participants cp ON cp.user_id = u.id
            JOIN chats c ON c.id = cp.chat_id AND c.type = 'direct'
            LEFT JOIN messages m ON m.chat_id = c.id
            LEFT JOIN users u2 ON u2.id = m.sender_id
            WHERE u.id != $1
            AND EXISTS (
                SELECT 1
                FROM chat_participants cp2
                WHERE cp2.chat_id = c.id
                AND cp2.user_id = $1
            )
            ORDER BY c.id, m.created_at DESC
        ), groups_in_chat AS(
            SELECT DISTINCT ON (c.id)
                gd.chat_id AS ug_id,
                gd.name,
                gd.picture,
                c.id AS chat_id,
                m.id AS last_message_id,
                m.content AS last_message_content,
                m.sender_id AS last_message_sender,
                u.username AS last_message_sender_username,
                m.created_at AS last_message_created_at
            FROM chats c
            JOIN group_details gd ON gd.chat_id = c.id
            JOIN chat_participants cp ON cp.chat_id = c.id
            JOIN messages m ON m.chat_id = c.id
            JOIN users u ON u.id = m.sender_id
            WHERE c.type = 'group'
            AND cp.user_id = $1
            ORDER BY c.id, m.created_at DESC
        )
        SELECT *, 'direct' AS type FROM users_in_chat
        UNION ALL
        SELECT *, 'group' AS type FROM groups_in_chat
        `,
    [userId],
  );

  return chats.rows;
};
