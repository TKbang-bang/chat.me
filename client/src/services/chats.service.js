import api from "./api.service";

export const getChats = async () => {
  try {
    const response = await api.get(`/chats`);
    if (response.status !== 200)
      return { success: false, message: response.data.error.message };

    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}`);
    if (response.status !== 200)
      return { success: false, message: response.data.error.message };

    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};
