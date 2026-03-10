import api from "./api.service";

export const crateGroup = async (name, description) => {
  try {
    const response = await api.post("/groups/create", { name, description });
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
