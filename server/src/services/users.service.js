import {
  getAllUsers,
  userBlock,
  userUnblock,
} from "../repositories/users.repository.js";

export const getAllUsersService = async (userId) => {
  const users = await getAllUsers(userId);

  return users;
};

export const userBlockService = async (userId, myId) => {
  // blcoking user
  await userBlock(userId, myId);
};
export const userUnBlockService = async (userId, myId) => {
  // blcoking user
  await userUnblock(userId, myId);
};
