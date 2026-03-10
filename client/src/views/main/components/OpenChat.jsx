import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function OpenChat() {
  const { chatId } = useParams();

  useEffect(() => {
    console.log(chatId);
  });

  return (
    <div className="on-chat open-chat">
      <h1>OpenChat</h1>
      <h3>Chat id: {chatId}</h3>
    </div>
  );
}

export default OpenChat;
