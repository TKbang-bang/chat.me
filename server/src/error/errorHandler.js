const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        about: err.about,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
      about: "server error",
    },
  });
};

export default errorHandler;
