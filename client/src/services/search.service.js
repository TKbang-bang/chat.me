import api from "./api.service";

export const searchService = async (word) => {
  try {
    const response = await api.get(`/search/${word}`);
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
