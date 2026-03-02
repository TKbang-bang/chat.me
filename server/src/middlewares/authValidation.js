import ServerError from "../error/ServerError.js";

export const authValidation = (req, res, next) => {
  const { firstname, lastname, username, email, password } = req.body;
  if (!firstname || !lastname || !username || !email || !password)
    throw new ServerError("All fields are required", "auth fields", 400);

  const nameValidationResult = nameValidation(firstname, lastname);
  if (!nameValidationResult.success)
    throw new ServerError(nameValidationResult.message, "name validation", 400);

  const usernameValidationResult = usernameValidation(username);
  if (!usernameValidationResult.success)
    throw new ServerError(
      usernameValidationResult.message,
      "username validation",
      400,
    );

  const emailValidationResult = emailValidation(email);
  if (!emailValidationResult.success)
    throw new ServerError(
      emailValidationResult.message,
      "email validation",
      400,
    );

  const passwordValidationResult = passwordValidation(password);
  if (!passwordValidationResult.success)
    throw new ServerError(
      passwordValidationResult.message,
      "password validation",
      400,
    );

  req.body.firstname = firstname.trim();
  req.body.lastname = lastname.trim();
  req.body.username = username.trim().toLowerCase();
  req.body.email = email.trim().toLowerCase();

  next();
};

const usernameValidation = (username) => {
  if (username.length < 3 || username.length > 20)
    return {
      success: false,
      message: "Username must be between 3 and 20 characters",
    };

  return { success: true };
};

const nameValidation = (firstname, lastname) => {
  if (firstname.length < 3 || firstname.length > 20)
    return {
      success: false,
      message: "First name must be between 3 and 20 characters",
    };
  if (lastname.length < 3 || lastname.length > 20)
    return {
      success: false,
      message: "Last name must be between 3 and 20 characters",
    };

  if (firstname == lastname)
    return {
      success: false,
      message: "First name and last name must be different",
    };

  return { success: true };
};

const passwordValidation = (password) => {
  if (password.length < 6 || password.length > 20)
    return {
      success: false,
      message: "Password must be between 6 and 20 characters",
    };

  const letters = /[A-Za-z]/g;
  const numbers = /[0-9]/g;
  if (!password.match(letters) || !password.match(numbers))
    return {
      success: false,
      message: "Password must contain at least one letter and one number",
    };

  return { success: true };
};

const emailValidation = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return {
      success: false,
      message: "Invalid email format",
    };

  return { success: true };
};
