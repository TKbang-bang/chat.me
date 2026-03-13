import { getChatsService } from "../services/chats.service.js";

export const getChatsController = async (req, res, next) => {
  try {
    const chats = await getChatsService(req.userId);

    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    return next(error);
  }
};
