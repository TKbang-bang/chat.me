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

export const getUserRequest = async (myId, toUserId) => {
  const request = await pool.query(
    `SELECT * FROM users_chat_requests WHERE sender_id = $1 AND receiver_id = $2;`,
    [myId, toUserId],
  );

  return request.rows[0];
};

export const getGroupRequest = async (myId, chatId) => {
  const request = await pool.query(
    `SELECT * FROM groups_chat_requests WHERE sender_id = $1 AND chat_id = $2;`,
    [myId, chatId],
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
