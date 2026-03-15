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

export const getChatById = async (id) => {
  const chat = await pool.query(`SELECT * FROM chats WHERE id = $1`, [id]);

  return chat.rows[0];
};

export const getUserChatMessages = async (chatId, userId) => {
  // getting chat
  const chat = await pool.query(
    `
        SELECT
            id,
            type
        FROM chats
        WHERE id = $1
        AND type = 'direct'
        `,
    [chatId],
  );

  // getting user (direct chat)
  const user = await pool.query(
    `
    SELECT
        u.id,
        u.username AS name,
        up.picture,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM users_blocked
            WHERE user_id = $2
            AND blocked_user_id = u.id
        ) THEN true
        ELSE false
        END AS is_blocked
    FROM users u
    LEFT JOIN user_profiles up ON up.user_id = u.id
    JOIN chat_participants cp ON cp.user_id = u.id AND cp.chat_id = $1
    WHERE u.id != $2
    `,
    [chatId, userId],
  );

  // getting messages
  const messages = await pool.query(
    `
    SELECT
        *
    FROM messages
    WHERE chat_id = $1
    ORDER BY created_at ASC
    `,
    [chatId],
  );

  return { chat: chat.rows[0], user: user.rows[0], messages: messages.rows };
};

export const getGroupChatMessages = async (chatId) => {
  // getting chat
  const chat = await pool.query(
    `
          SELECT
              id,
              type
          FROM chats
          WHERE id = $1
          AND type = 'group'
          `,
    [chatId],
  );

  // getting group details
  const group = await pool.query(
    `
      SELECT
          chat_id AS id,
          name,
          picture
      FROM group_details
      WHERE chat_id = $1
      `,
    [chatId],
  );

  // getting messages
  const messages = await pool.query(
    `
      SELECT
          m.*,
          u.username AS sender_username,
          up.picture
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE chat_id = $1
      ORDER BY created_at ASC
      `,
    [chatId],
  );

  return { chat: chat.rows[0], group: group.rows[0], messages: messages.rows };
};

export const getUserChatInfo = async (chatId, userId) => {
  const user = await pool.query(
    `
    SELECT
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        up.picture,
        'direct' AS type,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM users_blocked
            WHERE user_id = $2
            AND blocked_user_id = u.id
          ) THEN true
          ELSE false
        END AS is_blocked
    FROM users u
    LEFT JOIN user_profiles up ON up.user_id = u.id
    JOIN chat_participants cp ON cp.user_id = u.id AND cp.chat_id = $1
    JOIN chats c ON c.id = cp.chat_id AND c.type = 'direct'
    WHERE u.id != $2
    `,
    [chatId, userId],
  );

  return user.rows[0];
};

export const getGroupChatInfo = async (chatId, userId) => {
  const group = await pool.query(
    `
    SELECT
        gd.chat_id AS id,
        gd.name,
        gd.picture,
        gd.description,
        CASE
          WHEN cp.role = 'admin' THEN true
          ELSE false
        END AS is_admin,
        'group' AS type
    FROM group_details gd
    JOIN chat_participants cp ON cp.chat_id = gd.chat_id AND cp.user_id = $2
    WHERE gd.chat_id = $1
    `,
    [chatId, userId],
  );

  return group.rows[0];
};

export const getUsersInChat = async (chatId) => {
  const users = await pool.query(
    `
    SELECT
      u.id,
      u.username,
      up.picture,
      cp.role
    FROM chat_participants cp
    JOIN users u ON u.id = cp.user_id
    LEFT JOIN user_profiles up ON up.user_id = u.id
    WHERE cp.chat_id = $1
    `,
    [chatId],
  );

  return users.rows;
};

export const leaveGroupChatNormal = async (chatId, userId) => {
  await pool.query(
    `
    DELETE FROM chat_participants cp
    USING chats c
    WHERE c.id = cp.chat_id
    AND c.type = 'group'
    AND cp.chat_id = $1
    AND cp.user_id = $2
    `,
    [chatId, userId],
  );
};

export const leaveGroupChatAsAdmin = async (chatId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // deleing admin
    await pool.query(
      `
      DELETE FROM chat_participants cp
      USING chats c
      WHERE c.id = cp.chat_id
      AND c.type = 'group'
      AND cp.chat_id = $1
      AND cp.user_id = $2
      `,
      [chatId, userId],
    );

    // getting first user after admin
    const fisrtUser = await pool.query(
      `
      SELECT cp.user_id
      FROM chat_participants cp
      WHERE cp.chat_id = $1
      ORDER BY cp.joined_at ASC
      LIMIT 1
      `,
      [chatId],
    );

    // setting first user as admin
    fisrtUser.rows[0] &&
      (await pool.query(
        `
      UPDATE chat_participants
      SET role = 'admin'
      WHERE chat_id = $1 AND user_id = $2
      `,
        [chatId, fisrtUser.rows[0].user_id],
      ));

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteGroupChat = async (chatId) => {
  await pool.query(
    `
      DELETE FROM chats
      WHERE id = $1
    `,
    [chatId],
  );
};
