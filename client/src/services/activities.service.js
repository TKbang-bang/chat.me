import api from "./api.service";

export const sendRequest = async (id, type) => {
  try {
    const response = await api.post(`/activities/requests`, { id, type });
    if (response.status !== 201)
      return { success: false, message: response.data.error.message };

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const cancelRequest = async (id, type) => {
  try {
    const response = await api.post(`/activities/requests/cancel`, {
      id,
      type,
    });
    if (response.status !== 201)
      return { success: false, message: response.data.error.message };

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const getRequests = async () => {
  try {
    const response = await api.get(`/activities/requests`);
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

export const requestAccept = async (requestId, userId, type, chatId) => {
  try {
    const response = await api.post(`/activities/requests/accept`, {
      requestId,
      userId,
      type,
      chatId,
    });

    if (response.status !== 201)
      return { success: false, message: response.data.error.message };

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const requestDecline = async (requestId, userId, type) => {
  try {
    const response = await api.post(`/activities/requests/decline`, {
      requestId,
      userId,
      type,
    });

    if (response.status !== 201)
      return { success: false, message: response.data.error.message };

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};
