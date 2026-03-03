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

export const deletePreUser = async (id) => {
  const user = await pool.query(
    `DELETE FROM pending_users WHERE id = $1 RETURNING *;`,
    [id],
  );

  return user.rows[0];
};

export const createUser = async (id) => {
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

  return user.rows[0];
};
