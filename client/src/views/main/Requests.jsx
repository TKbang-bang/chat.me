import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getRequests,
  requestAccept,
  requestDecline,
} from "../../services/activities.service";
import "./.css";
import { AcceptIcon, CloseIcon, GroupIcon, UserIcon } from "../../svg/svgs";

function Requests() {
  const [requests, setRequests] = useState([]);

  const handleAcceptRequest = async (
    requestId,
    userId,
    type,
    chatId = null,
  ) => {
    try {
      const res = await requestAccept(requestId, userId, type, chatId);
      if (!res.success) return toast.error(res.message);

      setRequests(
        requests.filter(
          (request) =>
            request.request_id !== requestId && request.type !== type,
        ),
      );
    } catch (error) {
      return toast.error(error.response?.data?.error?.message || error.message);
    }
  };

  const handleDeclineRequest = async (requestId, userId, type) => {
    try {
      const res = await requestDecline(requestId, userId, type);
      if (!res.success) return toast.error(res.message);

      setRequests(
        requests.filter(
          (request) =>
            request.request_id !== requestId && request.type !== type,
        ),
      );
    } catch (error) {
      return toast.error(error.response?.data?.error?.message || error.message);
    }
  };

  useEffect(() => {
    const getAllRequests = async () => {
      try {
        const res = await getRequests();
        if (!res.success) return toast.error(res.message);

        setRequests(res.data);
      } catch (error) {
        return toast.error(
          error.response?.data?.error?.message || error.message,
        );
      }
    };

    getAllRequests();
  }, []);

  return (
    <div className="requests">
      {requests.length > 0 ? (
        <div className="oft">
          {requests.map((request, index) => {
            return (
              <article key={index}>
                <img
                  src={
                    request.profile
                      ? `${import.meta.env.VITE_API_URL}/public/profiles/${request.profile}`
                      : "/no-user.png"
                  }
                  alt={request.username}
                />
                <div className="extra">
                  {request.type === "group" && <p>{request.chat_name}</p>}
                  <h3>{request.username}</h3>
                </div>
                <div className="actions">
                  <button
                    className="accept"
                    onClick={() =>
                      handleAcceptRequest(
                        request.request_id,
                        request.id,
                        request.type,
                        request.type === "group" ? request.chat_id : null,
                      )
                    }
                  >
                    <AcceptIcon />
                    Accept
                  </button>
                  <button
                    className="decline"
                    onClick={() =>
                      handleDeclineRequest(
                        request.request_id,
                        request.id,
                        request.type,
                      )
                    }
                  >
                    <CloseIcon />
                    Decline
                  </button>
                </div>
                <button className="type">
                  {request.type == "group" ? <GroupIcon /> : <UserIcon />}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="not-searched">
          <h1>No requests</h1>
        </div>
      )}
    </div>
  );
}

export default Requests;
