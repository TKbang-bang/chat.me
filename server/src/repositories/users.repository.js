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

export const preSignUser = async (
  firstname,
  lastname,
  username,
  email,
  password,
  code,
) => {
  const user = await pool.query(
    `INSERT INTO pending_users (first_name, last_name, username, email, password, verify_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [firstname, lastname, username, email, password, code],
  );

  return user.rows[0];
};
