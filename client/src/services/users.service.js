import api from "./api.service";

export const getAllUsers = async () => {
  try {
    const response = await api.get(`/users`);
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

export const userBlock = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/block`);
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

export const userUnBlock = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/unblock`);
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
