import pool from "../db/pool.js";

export const createGroup = async (name, description, userId) => {
  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query("BEGIN");

    // Create group
    const chat = await client.query(
      `
      INSERT INTO chats(type)
      VALUES ('group')
      RETURNING id;
      `,
    );

    // save group id
    const chatId = chat.rows[0].id;

    // insert group details
    await client.query(
      `
      INSERT INTO group_details(chat_id, name, description, created_by)
      VALUES ($1, $2, $3, $4);
      `,
      [chatId, name, description, userId],
    );

    // insert admin
    await client.query(
      `
      INSERT INTO chat_participants(user_id, chat_id, role)
      VALUES ($1, $2, 'admin');
      `,
      [userId, chatId],
    );

    // insert first message
    await client.query(
      `
      INSERT INTO messages(chat_id, sender_id, content)
      VALUES ($1, $2, 'Hello, welcome to the group!');
      `,
      [chatId, userId],
    );

    // Commit transaction
    await client.query("COMMIT");

    return { chatId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getGroupChatById = async (id) => {
  const group = await pool.query(
    `SELECT * FROM group_details WHERE chat_id = $1;`,
    [id],
  );

  return group.rows[0];
};
