import io from "socket.io-client";
import { isUserLogged } from "../services/auth.service";
import { getAccessToken } from "../services/token.service";
import { toast } from "sonner";

let socket = null;

const socketService = async () => {
  if (socket) return socket;

  try {
    const response = await isUserLogged();
    if (!response.success) return null;

    const token = getAccessToken();
    if (!token) return null;

    socket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
      auth: { token },
    });

    socket.on("connect_error", (err) => {
      toast.error(err.message);
    });

    socket.on("server_error", (message) => toast.error(message));

    return socket;
  } catch {
    return null;
  }
};

export default socketService;
