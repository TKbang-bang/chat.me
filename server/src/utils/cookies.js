const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

export const sendingCookieToken = (res, accessToken, refreshToken) => {
  return res
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json({
      success: true,
      data: { accessToken },
    });
};
