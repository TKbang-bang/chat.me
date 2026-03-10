import React from "react";
import { Route, Routes } from "react-router-dom";
import "./.css";
import OpenChat from "./components/OpenChat";

function ChatViewer() {
  return (
    <div className="chat-over-view">
      <aside>
        <h1>Aside</h1>
      </aside>

      <Routes>
        <Route
          path="/chats"
          element={
            <div className="on-chat no-chat">
              <h1>Open a chat</h1>
            </div>
          }
        />
        <Route path="/chats/:chatId" element={<OpenChat />} />
      </Routes>
    </div>
  );
}

export default ChatViewer;
