import { createGroupService } from "../services/groups.service.js";

export const createGroupController = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    await createGroupService(name, description, req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};
