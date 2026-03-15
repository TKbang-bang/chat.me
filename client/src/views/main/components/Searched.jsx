import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { searchService } from "../../../services/search.service";
import "./.css";
import {
  cancelRequest,
  sendRequest,
} from "../../../services/activities.service";

function Searched() {
  const [results, setResults] = useState([]);
  const { word } = useParams();
  const navigate = useNavigate();

  const handleSendRequest = async (id, type) => {
    try {
      const res = await sendRequest(id, type);
      if (!res.success) return toast.error(res.message);

      setResults(
        results.map((result) =>
          result.id === id ? { ...result, has_sent_request: true } : result,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.error?.message || error.message);
    }
  };

  const handleCancelRequest = async (id, type) => {
    try {
      const res = await cancelRequest(id, type);
      if (!res.success) return toast.error(res.message);

      setResults(
        results.map((result) =>
          result.id === id ? { ...result, has_sent_request: false } : result,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.error?.message || error.message);
    }
  };

  useEffect(() => {
    const getSearched = async () => {
      try {
        const res = await searchService(word);
        if (!res.success) return toast.error(res.message);

        setResults(res.data);
        console.log(res.data);
      } catch (error) {
        return toast.error(
          error.response?.data?.error?.message || error.message,
        );
      }
    };

    getSearched();
  }, [word]);

  return (
    <div className="searched">
      {results.length == 0 ? (
        <div className="not-searched">
          <h1>No results for "{word}"</h1>
        </div>
      ) : (
        <div className="results">
          {results &&
            results.map((result) => {
              return (
                <article key={result.id} className="result">
                  <img
                    src={
                      result.picture
                        ? `${import.meta.env.VITE_API_URL}/public/profiles/${result.picture}`
                        : result.type == "direct"
                          ? "/no-user-2.png"
                          : "/no-group.png"
                    }
                    alt=""
                  />

                  <div className="extra">
                    <h3>{result.name}</h3>

                    {result.is_in_chat ? (
                      <button
                        onClick={() => navigate(`/chats/${result.chat_id}`)}
                      >
                        Go to chat
                      </button>
                    ) : (
                      <>
                        {result.has_sent_request ? (
                          <button
                            className="cancel"
                            onClick={() =>
                              handleCancelRequest(result.id, result.type)
                            }
                          >
                            Cancel request
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleSendRequest(result.id, result.type)
                            }
                          >
                            Send request
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Searched;
