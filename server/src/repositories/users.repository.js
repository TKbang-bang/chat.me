import pool from "../db/pool.js";

export const getUserByEmail = async (email) => {
  const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  return user.rows[0];
};

export const getUserById = async (id) => {
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  return user.rows[0];
};

export const getUserByUsername = async (username) => {
  const user = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  return user.rows[0];
};

export const getPreUserByEmail = async (email) => {
  const user = await pool.query(
    `SELECT * FROM pending_users WHERE email = $1`,
    [email],
  );

  return user.rows[0];
};

export const getPreUserById = async (id) => {
  const user = await pool.query(`SELECT * FROM pending_users WHERE id = $1`, [
    id,
  ]);

  return user.rows[0];
};

export const getPreUserByUsername = async (username) => {
  const user = await pool.query(
    `SELECT * FROM pending_users WHERE username = $1`,
    [username],
  );

  return user.rows[0];
};

export const getPreUserByToken = async (token) => {
  const user = await pool.query(
    `SELECT * FROM pending_users WHERE verification_token = $1`,
    [token],
  );

  return user.rows[0];
};

export const preUserCodeRefresh = async (token, code) => {
  const user = await pool.query(
    `UPDATE pending_users SET verification_code = $2, expires_at = CURRENT_TIMESTAMP + INTERVAL '5 minutes' WHERE verification_token = $1 RETURNING *;`,
    [token, code],
  );

  return user.rows[0];
};

export const preSignUser = async (
  firstname,
  lastname,
  username,
  email,
  password,
  code,
  token,
) => {
  const user = await pool.query(
    `INSERT INTO pending_users (first_name, last_name, username, email, password, verification_code, verification_token) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
    [firstname, lastname, username, email, password, code, token],
  );

  return user.rows[0];
};

export const createUser = async (id) => {
  const client = await pool.connect();
  try {
    client.query("BEGIN");

    // create user
    const user = await pool.query(
      `
    INSERT INTO users (first_name, last_name, username, email, password)
    SELECT first_name, last_name, username, email, password
    FROM pending_users
    WHERE id = $1
    RETURNING *;
    `,
      [id],
    );

    // delete pending user
    await pool.query(`DELETE FROM pending_users WHERE id = $1;`, [id]);

    client.query("COMMIT");

    return user.rows[0];
  } catch (error) {
    client.query("ROLLBACK");
    throw error;
  }
};

export const userBlock = async (userId, myId) => {
  await pool.query(
    `
    INSERT INTO users_blocked (user_id, blocked_user_id)
    VALUES ($1, $2);
    `,
    [myId, userId],
  );
};

export const userUnblock = async (userId, myId) => {
  await pool.query(
    `
    DELETE FROM users_blocked
    WHERE user_id = $1 AND blocked_user_id = $2;
    `,
    [myId, userId],
  );
};

export const getAllUsers = async (userId) => {
  const users = await pool.query(
    `
    WITH users_search AS (
        SELECT
            u.id,
            u.username,
            up.picture,
            (
                SELECT c.id
                FROM chats c
                JOIN chat_participants cp1 ON cp1.chat_id = c.id AND cp1.user_id = u.id
                JOIN chat_participants cp2 ON cp2.chat_id = c.id AND cp2.user_id = $1
                WHERE c.type = 'direct'
                LIMIT 1
            ) AS chat_id
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id != $1
                ),
    my_chats AS (
        SELECT
            cp.chat_id,
            c.type
        FROM chat_participants cp
        LEFT JOIN chats c ON cp.chat_id = c.id
        WHERE cp.user_id = $1
    ),
    my_blocked_users AS (
        SELECT
            blocked_user_id
        FROM users_blocked
        WHERE user_id = $1
    ),
    my_users_requests AS(
        SELECT
            receiver_id
        FROM users_chat_requests
        WHERE sender_id = $1
    )
    SELECT
        us.id,
        us.username AS name,
        us.picture,
        us.chat_id,
        'direct' AS type,
        CASE
            WHEN us.chat_id IN (SELECT chat_id FROM my_chats) THEN true
            ELSE false
        END AS is_in_chat,
        CASE
            WHEN us.id IN (SELECT receiver_id FROM my_users_requests) THEN true
            ELSE false
        END AS has_sent_request,
        CASE
            WHEN EXISTS (
                SELECT
                    mb.blocked_user_id
                FROM my_blocked_users mb
                WHERE mb.blocked_user_id = us.id )
            THEN true
            ELSE false
        END AS is_blocked
    FROM users_search us;
    `,
    [userId],
  );

  return users.rows;
};
