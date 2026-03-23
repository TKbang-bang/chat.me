import {
  getAllUsersService,
  userBlockService,
  userUnBlockService,
} from "../services/users.service.js";

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsersService(req.userId);

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

export const userBlockController = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await userBlockService(userId, req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};

export const userUnBlockController = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await userUnBlockService(userId, req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};
