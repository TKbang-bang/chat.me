import React, { useState } from "react";
import { SearchIcon2 } from "../../svg/svgs";

function Search() {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;

    console.log(search);
  };

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

      <div className="search-results"></div>
    </div>
  );
}

export default Search;
