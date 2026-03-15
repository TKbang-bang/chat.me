import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getChatInfo } from "../../../services/chats.service";
import "./.css";
import { CloseIcon } from "../../../svg/svgs";

function InfoContainer({ chatId }) {
  const [chatInfo, setChatInfo] = useState({});

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await getChatInfo(chatId);
        if (!res.success) return toast.error(res.message);

        setChatInfo(res.data);
      } catch (error) {
        return toast.error(error.response.data.error.message || error.message);
      }
    };

    getInfo();
  }, [chatId]);

  return (
    <div className="info-container">
      <button
        className="close"
        onClick={() =>
          document.querySelector(".info-container").classList.remove("active")
        }
      >
        <CloseIcon />
      </button>
      {chatInfo && (
        <>
          {chatInfo.type == "direct" ? (
            <div className="principal-container">
              <div className="principal">
                <img
                  src={
                    chatInfo.picture
                      ? `${import.meta.env.VITE_API_URL}/public/profiles/${chatInfo.picture}`
                      : "/no-user.png"
                  }
                  alt=""
                />
                <p className="alias">@{chatInfo.username}</p>
                <p>
                  {chatInfo.first_name} {chatInfo.last_name}
                </p>
              </div>

              <div className="options">
                <button className="block">Block</button>
              </div>
            </div>
          ) : (
            <div className="principal-container">
              <div className="principal">
                <img
                  src={
                    chatInfo.picture
                      ? `${import.meta.env.VITE_API_URL}/public/profiles/${chatInfo.picture}`
                      : "/no-group.png"
                  }
                  alt=""
                />
                <p className="alias">@{chatInfo.name}</p>
              </div>

              <div className="options">
                <button>Leave</button>
                {chatInfo.is_admin && <button className="block">Delete</button>}
              </div>

              <div className="users">
                {chatInfo?.users?.map((user) => (
                  <div className="user" key={user.id}>
                    <div className="_u">
                      <img
                        src={
                          user.picture
                            ? `${import.meta.env.VITE_API_URL}/public/profiles/${user.picture}`
                            : "/no-user.png"
                        }
                        alt=""
                      />
                      <p className="alias">@{user.username}</p>
                      <p className="role">{user.role}</p>
                    </div>
                    {chatInfo.is_admin && (
                      <>{user.role != "admin" && <button>Kick out</button>}</>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default InfoContainer;
