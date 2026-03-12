import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getRequests } from "../../services/activities.service";
import "./.css";
import { AcceptIcon, CloseIcon, GroupIcon, UserIcon } from "../../svg/svgs";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getAllRequests = async () => {
      try {
        const res = await getRequests();
        if (!res.success) return toast.error(res.message);

        setRequests(res.data);
        console.log(res.data);
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
                  <button className="accept">
                    <AcceptIcon />
                    Accept
                  </button>
                  <button className="decline">
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
        <div className="no-requests">
          <h1>No requests</h1>
        </div>
      )}
    </div>
  );
}

export default Requests;
