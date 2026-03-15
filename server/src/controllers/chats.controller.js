import {
  getChatInfoService,
  getChatMessagesService,
  getChatsService,
  leaveGroupChatService,
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

export const getChatInfoController = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const info = await getChatInfoService(chatId, req.userId);

    return res.status(200).json({ success: true, data: info });
  } catch (error) {
    return next(error);
  }
};

export const leaveGroupChatController = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    await leaveGroupChatService(chatId, req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};
