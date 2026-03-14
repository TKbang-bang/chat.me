import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, CloseIcon, SendIcon } from "../../../svg/svgs";
import "./.css";
import { toast } from "sonner";
import { getChatMessages } from "../../../services/chats.service";

function OpenChat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState({});
  const [messgae, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleGettingChatMessages = async () => {
      try {
        const res = await getChatMessages(chatId);
        if (!res.success) return toast.error(res.message);

        setChatMessages(res.data);
        return;
      } catch (error) {
        return toast.error(error.response.data.error.message || error.message);
      }
    };

    handleGettingChatMessages();
  }, [chatId]);

  return (
    <div className="on-chat open-chat">
      <div className="chat-container">
        <div className="chat-header">
          <button className="back" onClick={() => navigate("/chats")}>
            <ArrowLeftIcon />
          </button>
          <div className="info">
            {chatMessages && chatMessages?.chat?.type == "group" ? (
              <img
                src={
                  chatMessages?.group?.picture
                    ? `${import.meta.env.VITE_BACKEND_URL}/public/profiles/${chatMessages?.group?.picture}`
                    : "/no-group.png"
                }
                alt={chatMessages?.group?.name}
              />
            ) : (
              <img
                src={
                  chatMessages?.user?.picture
                    ? `${import.meta.env.VITE_BACKEND_URL}/public/profiles/${chatMessages?.user?.picture}`
                    : "/no-user.png"
                }
                alt={chatMessages?.user?.name}
              />
            )}
            <h3>
              {chatMessages && chatMessages?.chat?.type == "group"
                ? chatMessages?.group?.name
                : chatMessages?.user?.name}
            </h3>
          </div>
        </div>
        <div className="messages-container">
          {chatMessages?.chat?.type == "group" ? (
            <>
              {chatMessages?.messages.map((message) => {
                return (
                  <article
                    className={`message-container ${message?.me && "me"}`}
                    key={message.id}
                  >
                    <img
                      src={
                        message?.picture
                          ? `${import.meta.env.VITE_BACKEND_URL}/public/profiles/${message?.picture}`
                          : "/no-user.png"
                      }
                      alt={message?.username}
                    />

                    <div className="message">
                      <h3>{message?.username}</h3>
                      <p className="content">{message?.content}</p>
                      <p className="date">{message?.created_at}</p>
                    </div>
                  </article>
                );
              })}
            </>
          ) : (
            <>
              {chatMessages?.messages?.map((message) => {
                return (
                  <article
                    className={`message-container ${message?.me && "me"}`}
                    key={message.id}
                  >
                    <div className="message">
                      <p className="content">{message?.content}</p>
                      <p className="date">{message?.created_at}</p>
                    </div>
                  </article>
                );
              })}
            </>
          )}
        </div>

        <div className="message-form-container">
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              placeholder="Type a message"
              value={messgae}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
      <div className="info-container">
        <h1>Chat info</h1>
      </div>
    </div>
  );
}

export default OpenChat;
