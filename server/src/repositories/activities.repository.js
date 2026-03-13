import pool from "../db/pool.js";

export const sendUserRequest = async (myId, toUserId) => {
  await pool.query(
    `INSERT INTO users_chat_requests (sender_id, receiver_id) VALUES ($1, $2);`,
    [myId, toUserId],
  );
};

export const sendGroupRequest = async (myId, chatId) => {
  await pool.query(
    `INSERT INTO groups_chat_requests (sender_id, chat_id) VALUES ($1, $2);`,
    [myId, chatId],
  );
};

export const getUserRequest = async (senderId, receiverId) => {
  const request = await pool.query(
    `SELECT * FROM users_chat_requests WHERE sender_id = $1 AND receiver_id = $2;`,
    [senderId, receiverId],
  );

  return request.rows[0];
};

export const getGroupRequest = async (senderId, chatId) => {
  const request = await pool.query(
    `SELECT * FROM groups_chat_requests WHERE sender_id = $1 AND chat_id = $2;`,
    [senderId, chatId],
  );

  return request.rows[0];
};

export const cancelUserRequest = async (myId, toUserId) => {
  await pool.query(
    `DELETE FROM users_chat_requests WHERE sender_id = $1 AND receiver_id = $2;`,
    [myId, toUserId],
  );
};

export const cancelGroupRequest = async (myId, chatId) => {
  await pool.query(
    `DELETE FROM groups_chat_requests WHERE sender_id = $1 AND chat_id = $2;`,
    [myId, chatId],
  );
};

export const getRequests = async (myId) => {
  const requests = await pool.query(
    `
    WITH users_requests AS (
      SELECT
        r.id AS request_id,
        u.id,
        u.username,
        up.picture
      FROM users u
      JOIN users_chat_requests r
        ON r.sender_id = u.id
      LEFT JOIN user_profiles up
        ON u.id = up.user_id
      WHERE r.receiver_id = $1
    ),

    groups_requests AS (
      SELECT
        gr.id AS request_id,
        u.id,
        u.username,
        up.picture,
        g.chat_id,
        g.name
      FROM groups_chat_requests gr
      JOIN users u ON u.id = gr.sender_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      JOIN group_details g ON g.chat_id = gr.chat_id
      JOIN chat_participants cp ON cp.chat_id = gr.chat_id
      WHERE cp.user_id = $1
      AND cp.role = 'admin'
    )

    SELECT
      request_id,
      id,
      username,
      picture,
      'direct' AS type,
      NULL AS chat_name,
      NULL AS chat_id
    FROM users_requests

    UNION ALL

    SELECT
      request_id,
      id,
      username,
      picture,
      'group' AS type,
      name AS group_name,
      chat_id
    FROM groups_requests;
  `,
    [myId],
  );

  return requests.rows;
};

export const acceptUserRequest = async (requestId, userId, myId) => {
  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query("BEGIN");

    // create chat
    const chat = await client.query(
      `
      INSERT INTO chats(type)
      VALUES ('direct')
      RETURNING id;
      `,
    );

    const chatId = chat.rows[0].id;

    // insert participants
    await client.query(
      `
      INSERT INTO chat_participants(chat_id, user_id)
      VALUES ($1, $2),
            ($1, $3);
      `,
      [chatId, userId, myId],
    );

    // first message
    await client.query(
      `
      INSERT INTO messages(chat_id, sender_id, content)
      VALUES ($1, $2, 'Hello!');
      `,
      [chatId, userId],
    );

    // delete request
    await client.query(
      `
      DELETE FROM users_chat_requests
      WHERE sender_id = $1 AND receiver_id = $2 OR sender_id = $2 AND receiver_id = $1;
      `,
      [userId, myId],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const acceptGroupRequest = async (requestId, userId, chatId) => {
  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query("BEGIN");

    // insert participants
    await client.query(
      `
      INSERT INTO chat_participants(chat_id, user_id)
      VALUES ($1, $2);
      `,
      [chatId, userId],
    );

    // delete request
    await client.query(
      `
      DELETE FROM groups_chat_requests
      WHERE id = $1;
      `,
      [requestId],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
