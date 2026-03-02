import axios from "axios";

export const signup = async (data) => {
  try {
    const response = await axios.post("/auth/signup", data);
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};
