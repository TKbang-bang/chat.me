import React, { useEffect, useState } from "react";
import { SearchIcon2 } from "../../svg/svgs";
import { toast } from "sonner";
import { Route, Routes, useNavigate } from "react-router-dom";
import Searched from "./components/Searched";
import "./.css";

function Search() {
  const [search, setSearch] = useState(
    window.location.pathname == "/search/:word"
      ? setSearch(window.location.pathname.split("/")[2])
      : "",
  );
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;

    navigate(`/search/${search}`);
  };

  useEffect(() => {
    window.location.pathname.includes("/search/") &&
      setSearch(window.location.pathname.split("/")[2]);
  }, []);

  return (
    <div className="search-container">
      <div className="seach-form-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">
            <SearchIcon2 />
          </button>
        </form>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="not-searched">
              <h1>Start typing to search</h1>
            </div>
          }
        />

        <Route path="/:word" element={<Searched />} />
      </Routes>
    </div>
  );
}

export default Search;
