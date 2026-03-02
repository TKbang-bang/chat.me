import { signingUp } from "../services/auth.service.js";

export const signupController = async (req, res, next) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    await signingUp(firstname, lastname, username, email, password);

    return res.status(200).json({
      success: true,
      data: {
        message: "User signed up successfully",
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const verifyController = async (req, res, next) => {};
export const codeRefreshController = async (req, res, next) => {};
export const signinController = async (req, res, next) => {};
