import jwt from "jsonwebtoken";
export const createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
export const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
