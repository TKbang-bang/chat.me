import api from "./api.service";

export const sendRequest = async (id, type) => {
  try {
    const response = await api.post(`/activities/request`, { id, type });
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
    const response = await api.post(`/activities/request/cancel`, { id, type });
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
