import js from "@eslint/js";
import axios from "axios";

export const signup = async (data) => {
  try {
    const response = await axios.post("/auth/signup", data);
    if (response.status != 200)
      return { success: false, message: response.data.error.message };

    localStorage.setItem(
      "codeExpiresAt",
      (Date.now() + 5 * 60 * 1000).toString(),
    );

    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};
