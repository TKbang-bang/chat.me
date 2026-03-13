import { getChats } from "../repositories/chats.repository.js";
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
        created_at: myDate(chat.last_message_created_at),
      },
    };
  });

  return reformattedChats;
};
