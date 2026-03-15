import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteGroupChat,
  getChatInfo,
  leaveGroupChat,
} from "../../../services/chats.service";
import "./.css";
import { CloseIcon } from "../../../svg/svgs";
import { userBlock, userUnBlock } from "../../../services/users.service";

function InfoContainer({ chatId }) {
  const [chatInfo, setChatInfo] = useState({});

  const handleLeaveGroup = async (groupId) => {
    try {
      const res = await leaveGroupChat(groupId);
      if (!res.success) return toast.error(res.message);

      return (window.location.href = "/chats");
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const res = await deleteGroupChat(groupId);
      if (!res.success) return toast.error(res.message);

      window.location.href = "/chats";
    } catch (error) {
      toast.error(error.response?.data?.error?.message || error.message);
    }
  };

  const confirmDelete = (id) => {
    toast("Are you sure you want to delete this group?", {
      description: "This action cannot be undone.",
      action: {
        label: "Yes, delete",
        onClick: () => handleDeleteGroup(id),
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const handleBlock = async (id) => {
    try {
      const res = await userBlock(id);
      if (!res.success) return toast.error(res.message);

      return window.location.reload();
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

  const handleUnBlock = async (id) => {
    try {
      const res = await userUnBlock(id);
      if (!res.success) return toast.error(res.message);

      return window.location.reload();
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
  };

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
                {!chatInfo.is_blocked ? (
                  <button
                    className="block"
                    onClick={() => handleBlock(chatInfo.id)}
                  >
                    Block
                  </button>
                ) : (
                  <button onClick={() => handleUnBlock(chatInfo.id)}>
                    Unblock
                  </button>
                )}
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
                <p>{chatInfo.description}</p>
              </div>

              <div className="options">
                <button onClick={() => handleLeaveGroup(chatInfo.id)}>
                  Leave
                </button>
                {chatInfo.is_admin && (
                  <button
                    className="block"
                    onClick={() => confirmDelete(chatInfo.id)}
                  >
                    Delete
                  </button>
                )}
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
