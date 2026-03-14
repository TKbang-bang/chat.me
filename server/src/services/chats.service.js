import {
  getChatById,
  getChats,
  getGroupChatMessages,
  getUserChatMessages,
} from "../repositories/chats.repository.js";
import myDate from "../utils/dateFormat.js";

export const getChatsService = async (userId) => {
  const chats = await getChats(userId);

  const reformattedChats = chats.map((chat) => {
    return {
      ug_id: chat.ug_id,
      name: chat.name,
      picture: chat.picture,
      chat_id: chat.chat_id,
      type: chat.type,
      last_message: {
        id: chat.last_message_id,
        content: chat.last_message_content,
        sender_id: chat.last_message_sender,
        sender_name: chat.last_message_sender_username,
        me: chat.last_message_sender === userId,
        date: myDate(chat.last_message_created_at),
        created_at: chat.last_message_created_at,
      },
    };
  });

  return reformattedChats;
};

export const getChatMessagesService = async (chatId, userId) => {
  // verify if chat exists
  const chat = await getChatById(chatId);
  if (!chat) throw new ServerError("Chat not found", "chat", 404);

  if (chat.type == "direct") {
    const { chat, user, messages } = await getUserChatMessages(chatId, userId);

    const reformattedMessages = messages.map((message) => {
      return {
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        me: message.sender_id === userId,
        date: myDate(message.created_at),
        created_at: message.created_at,
      };
    });

    return { chat, user, messages: reformattedMessages };
  } else if (chat.type == "group") {
    const { chat, group, messages } = await getGroupChatMessages(
      chatId,
      userId,
    );

    const reformattedMessages = messages.map((message) => {
      return {
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        username: message.sender_username,
        picture: message.picture,
        me: message.sender_id === userId,
        date: myDate(message.created_at),
        created_at: message.created_at,
      };
    });

    return { chat, group, messages: reformattedMessages };
  } else {
    throw new ServerError("Invalid chat type", "type", 400);
  }
};
