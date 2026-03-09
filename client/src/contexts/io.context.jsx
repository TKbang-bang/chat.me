import React, { createContext, useEffect, useState } from "react";
import socketService from "../io/socket.js";
import { toast } from "sonner";

export const IoContext = createContext();

export function IoContextProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let activeSocket;

    const init = async () => {
      const s = await socketService();
      if (!s) return;

      activeSocket = s;
      setSocket(s);
    };

    init();

    return () => {
      activeSocket?.disconnect();
    };
  }, []);

  return <IoContext.Provider value={socket}>{children}</IoContext.Provider>;
}
