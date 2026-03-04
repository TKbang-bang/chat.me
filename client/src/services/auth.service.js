import axios from "axios";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "./token.service";

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

export const resendCode = async () => {
  try {
    const response = await axios.put("/auth/resend");
    if (response.status != 201)
      return { success: false, message: response.data.error.message };

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const codeVerify = async (code) => {
  try {
    const response = await axios.post("/auth/verify", { code });
    if (response.status != 200)
      return { success: false, message: response.data.error.message };

    // seting the access token
    setAccessToken(response.data.data.accessToken);

    // removing the code from the local storage
    localStorage.removeItem("codeExpiresAt");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const isUserLogged = async () => {
  try {
    const response = await axios.get("/auth/islogged", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    if (response.status != 201)
      return { success: false, message: response.data.error.message };

    if (response.headers["access-token"])
      setAccessToken(response.headers["access-token"].split(" ")[1]);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const signin = async (email, password) => {
  try {
    const response = await axios.post("/auth/signin", { email, password });
    if (response.status != 200)
      return { success: false, message: response.data.error.message };

    // seting the access token
    setAccessToken(response.data.data.accessToken);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};

export const logout = async () => {
  try {
    const response = await axios.delete("/auth/logout", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    if (response.status != 201)
      return { success: false, message: response.data.error.message };

    // removing the access token
    setAccessToken(null);
    removeAccessToken();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response.data.error.message || error.message,
    };
  }
};
