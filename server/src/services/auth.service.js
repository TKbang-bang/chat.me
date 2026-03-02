import bcrypt from "bcrypt";

import ServerError from "../error/ServerError.js";
import {
  getPreUserByEmail,
  getPreUserByUsername,
  getUserByEmail,
  getUserByUsername,
  preSignUser,
} from "../repositories/users.repository.js";
import emailSend from "../utils/nodemailer.js";

export const signingUp = async (
  firstname,
  lastname,
  username,
  email,
  password,
) => {
  // verefying if the email is already signed
  const userByEmail = await getUserByEmail(email);
  if (userByEmail) throw new ServerError("Email already exists", "email", 409);

  // verifying if the username is already signed
  const userByUsername = await getUserByUsername(username);
  if (userByUsername)
    throw new ServerError("Username already exists", "username", 409);

  // verefying if the email is being signed by someone else
  const preUserByEmail = await getPreUserByEmail(email);
  if (preUserByEmail)
    throw new ServerError(
      "Someone is already signing up with this email",
      "email",
      409,
    );

  // verefying if the username is being signed by someone else
  const preUserByUsername = await getPreUserByUsername(username);
  if (preUserByUsername)
    throw new ServerError(
      "Someone is already signing up with this username",
      "username",
      409,
    );

  // sneding verification code to user email
  const verifyCode = await emailSend(email);
  if (!verifyCode.success)
    throw new ServerError(verifyCode.message, "email code", 500);

  // hashing the password
  const hash = await bcrypt.hash(password, 10);
  // hashing the code
  const code = await bcrypt.hash(verifyCode.code, 10);

  // presigning the user
  await preSignUser(firstname, lastname, username, email, hash, code);
};
