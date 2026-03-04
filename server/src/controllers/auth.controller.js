import {
  getUserAuthenticated,
  resendingCode,
  signingIn,
  signingUp,
  verifyingCode,
} from "../services/auth.service.js";
import { cookieOptions, sendingCookieToken } from "../utils/cookies.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";

export const signupController = async (req, res, next) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    const user = await signingUp(
      firstname,
      lastname,
      username,
      email,
      password,
    );

    const isProduction = process.env.NODE_ENV === "production";

    return res
      .status(200)
      .cookie("signup-token", user.verification_token, {
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 5,
      })
      .json({
        success: true,
        data: {
          message: "A code has been sent to your email",
        },
      });
  } catch (error) {
    return next(error);
  }
};
export const codeRefreshController = async (req, res, next) => {
  try {
    const token = req.cookies["signup-token"];

    await resendingCode(token);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};
export const verifyController = async (req, res, next) => {
  try {
    const { code } = req.body;
    const token = req.cookies["signup-token"];

    // verifying code and creating real user
    const user = await verifyingCode(token, code);

    // creating tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    // deleting signup-token cookie
    res.clearCookie("signup-token");

    // sending tokens to client in cookies
    return sendingCookieToken(res, accessToken, refreshToken);
  } catch (error) {
    return next(error);
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    await getUserAuthenticated(req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};

export const signinController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await signingIn(email, password);

    // creating tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    // sending tokens to client in cookies
    sendingCookieToken(res, accessToken, refreshToken);
  } catch (error) {
    return next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    req.userId = null;
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};
