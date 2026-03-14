import {
  getChatMessagesService,
  getChatsService,
} from "../services/chats.service.js";

export const getChatsController = async (req, res, next) => {
  try {
    const chats = await getChatsService(req.userId);

    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    return next(error);
  }
};

export const getChatMessagesController = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const data = await getChatMessagesService(chatId, req.userId);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
