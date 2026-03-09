import "dotenv/config";
import http from "http";
import app from "./app.js";
import ioConnection from "./io/io.js";

const server = http.createServer(app);

// io
ioConnection(server);

// start server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
