import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { searchService } from "../../../services/search.service";
import "./.css";

function Searched() {
  const [results, setResults] = useState([]);
  const { word } = useParams();

  useEffect(() => {
    const getSearched = async () => {
      try {
        const res = await searchService(word);
        if (!res.success) return toast.error(res.message);

        setResults(res.data);
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
          {results.map((result) => {
            return (
              <article key={result.id} className="result">
                <img
                  src={
                    result.picture
                      ? `${import.meta.env.VITE_API_URL}/public/profiles/${result.picture}`
                      : result.type == "user"
                        ? "/no-user-2.png"
                        : "/no-group.png"
                  }
                  alt=""
                />

                <div className="extra">
                  <h3>{result.name}</h3>

                  {result.is_in_chat ? (
                    <button>Go to chat</button>
                  ) : (
                    <button>Send request</button>
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
