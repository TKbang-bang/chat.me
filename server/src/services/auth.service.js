import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

import ServerError from "../error/ServerError.js";
import {
  createUser,
  deletePreUser,
  getPreUserByEmail,
  getPreUserByToken,
  getPreUserByUsername,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  preSignUser,
  preUserCodeRefresh,
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
  // creating secret token
  const token = randomBytes(64).toString("hex");

  // presigning the user
  const presignedUser = await preSignUser(
    firstname,
    lastname,
    username,
    email,
    hash,
    code,
    token,
  );

  return presignedUser;
};

export const resendingCode = async (token) => {
  // verefying if the token is in cookie
  if (!token) throw new ServerError("Token may be expired", "token", 400);

  // verefying if the token is in db
  const userByToken = await getPreUserByToken(token);
  if (!userByToken)
    throw new ServerError("Token did not match any user", "user", 404);

  // verefying if the token is expired
  if (userByToken.expires_at < new Date())
    throw new ServerError(
      "Verification code may be expired",
      "verification code",
      400,
    );

  // sneding verification code to user email
  const verifyCode = await emailSend(userByToken.email);
  if (!verifyCode.success)
    throw new ServerError(verifyCode.message, "email code", 500);

  // hashing the code
  const code = await bcrypt.hash(verifyCode.code, 10);

  // updating the verification code in db
  await preUserCodeRefresh(token, code);
};

export const verifyingCode = async (token, code) => {
  // verefying if the token is in cookie
  if (!token) throw new ServerError("Token may be expired", "token", 400);

  // verefying if the token is in db
  const userByToken = await getPreUserByToken(token);
  if (!userByToken)
    throw new ServerError("Token did not match any user", "user", 404);

  // verefying if the pending user is expired
  if (userByToken.expires_at < new Date())
    throw new ServerError(
      "Verification code may be expired",
      "verification code",
      400,
    );

  // verefying if the code is correct
  const isCodeCorrect = await bcrypt.compare(
    code,
    userByToken.verification_code,
  );
  if (!isCodeCorrect)
    throw new ServerError("Verification code did not match", "code", 400);

  // creating new user
  const userCreated = await createUser(userByToken.id);

  // deleting pending user
  await deletePreUser(userByToken.id);

  return userCreated;
};

export const getUserAuthenticated = async (id) => {
  if (!id) throw new ServerError("User id is required", "user", 401);

  const user = await getUserById(id);
  if (!user) throw new ServerError("User not found", "user", 404);

  return;
};
