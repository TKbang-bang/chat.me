import {
  createMessage,
  getChatByParticipantId,
  getMessageSender,
  getUsersInChat,
} from "../repository/messages.repository.js";
import myDate from "../../utils/dateFormat.js";

export const createMessageService = async (data, userId) => {
  // verify if the user is allowed to send a message to the chat
  const chatByParticipant = await getChatByParticipantId(
    data.chat.id,
    userId,
    data.chat.type,
  );
  if (!chatByParticipant)
    throw new Error("You are not allowed to send messages", "chat", 404);

  // create message
  const messageCreated = await createMessage(
    chatByParticipant.chat_id,
    userId,
    data.content,
  );

  // format message
  if (data.chat.type == "direct") {
    return {
      id: messageCreated.id,
      content: messageCreated.content,
      sender_id: messageCreated.sender_id,
      me: messageCreated.sender_id === userId,
      created_at: myDate(messageCreated.created_at),
      chatId: messageCreated.chat_id,
    };
  } else {
    const messageSender = await getMessageSender(messageCreated.id);

    return {
      id: messageCreated.id,
      content: messageCreated.content,
      sender_id: messageCreated.sender_id,
      sender_name: messageSender.username,
      picture: messageSender.picture,
      me: messageCreated.sender_id === userId,
      created_at: messageCreated.created_at,
      date: myDate(messageCreated.created_at),
      chatId: messageCreated.chat_id,
    };
  }
};

export const getUsersInChatService = async (chatId) => {
  const { rows } = await getUsersInChat(chatId);

  return rows;
};
