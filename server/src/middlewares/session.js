import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import { cookieOptions } from "../utils/cookies.js";

const sessionMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  // token verification
  if (!accessToken && !refreshToken)
    return res.status(401).json({ message: "Unauthorized" });

  // if both tokens are present, verify access token first
  if (accessToken && accessToken != "null") {
    try {
      // verify access token
      const { userId } = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );
      // if access token is valid, set userId and proceed
      req.userId = userId;

      return next();
    } catch (error) {
      console.log("Invalid access token", error);
    }
  }

  // refresh token verification
  if (refreshToken) {
    try {
      // verify refresh token
      const { userId } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      // create new access and refresh tokens
      const newAccessToken = createAccessToken(userId);
      const newRefreshToken = createRefreshToken(userId);

      // set new tokens in response
      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      res.setHeader("access-token", `Bearer ${newAccessToken}`);
      req.userId = userId;

      return next();
    } catch (error) {
      console.log("Invalid refresh token", error);
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  }
};
export default sessionMiddleware;
