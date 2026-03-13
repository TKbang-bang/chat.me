import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getChats } from "../../../services/chats.service";
import { NavLink } from "react-router-dom";
import "./.css";

function ChatsList() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const gettingChats = async () => {
      try {
        const res = await getChats();
        if (!res.success) return toast.error(res.message);

        setChats(res.data);
      } catch (error) {
        return toast.error(error.response.data.error.message || error.message);
      }
    };

    gettingChats();
  }, []);

  return (
    <aside className="chats">
      <div className="chats-container">
        {chats.length > 0 ? (
          <>
            {chats.map((chat) => {
              return (
                <NavLink
                  to={`/chats/${chat.chat_id}`}
                  key={chat.chat_id}
                  className="chat"
                >
                  <img
                    src={
                      chat.picture
                        ? `${import.meta.env.VITE_BACKEND_URL}/public/profiles/${chat.picture}`
                        : chat.type == "direct"
                          ? "/no-user.png"
                          : "/no-group.png"
                    }
                    alt=""
                  />

                  <div className="extra">
                    <p className="name">{chat.name}</p>
                    <p className="message">
                      <span className="sender">
                        {chat.last_message.me
                          ? "you: "
                          : chat.type == "direct"
                            ? ""
                            : chat.last_message.sender_name + ": "}
                      </span>
                      <p className="content">{chat.last_message.content}</p>
                    </p>
                    <p className="date">
                      {/* {`${chat.last_message.created_at.split(".")[0].split("T")[0]}:${
                        chat.last_message.created_at.split(".")[0].split("T")[1]
                      }`} */}
                      {chat.last_message.created_at}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </>
        ) : (
          <h1>No chats</h1>
        )}
      </div>
    </aside>
  );
}

export default ChatsList;
