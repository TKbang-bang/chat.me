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
