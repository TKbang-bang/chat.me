import pool from "../../db/pool.js";

export const getChatByParticipantId = async (chatId, participantId, type) => {
  const chat = await pool.query(
    `
        SELECT cp.* FROM chat_participants cp
        JOIN chats c ON c.id = cp.chat_id AND c.type = $3
        WHERE cp.user_id = $1 AND cp.chat_id = $2
        `,
    [participantId, chatId, type],
  );

  return chat.rows[0];
};

export const createMessage = async (chatId, senderId, content) => {
  const message = await pool.query(
    `
        INSERT INTO messages (chat_id, sender_id, content)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
    [chatId, senderId, content],
  );

  return message.rows[0];
};

export const getMessageSender = async (messageId) => {
  const message = await pool.query(
    `
    SELECT
        u.id,
        u.username,
        up.picture
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    LEFT JOIN user_profiles up ON up.user_id = u.id
    WHERE m.id = $1
    `,
    [messageId],
  );

  return message.rows[0];
};

export const getUsersInChat = (chatId) => {
  return pool.query(
    `
    SELECT
        u.id
    FROM chat_participants cp
    JOIN users u ON u.id = cp.user_id
    WHERE cp.chat_id = $1
    `,
    [chatId],
  );
};
