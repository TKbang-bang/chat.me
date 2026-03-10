import pool from "../db/pool.js";

export const createGroup = async (name, description, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const chat = await client.query(
      `
      INSERT INTO chats(type)
      VALUES ('group')
      RETURNING id;
      `,
    );

    const chatId = chat.rows[0].id;

    await client.query(
      `
      INSERT INTO group_details(chat_id, name, description, created_by)
      VALUES ($1, $2, $3, $4);
      `,
      [chatId, name, description, userId],
    );

    await client.query("COMMIT");

    return { chatId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
