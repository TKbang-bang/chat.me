class ServerError extends Error {
  constructor(message, about, statusCode) {
    super(message);
    this.about = about;
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export default ServerError;
