import React, { useState } from "react";
import { SearchIcon2 } from "../../svg/svgs";
import { toast } from "sonner";
import { searchService } from "../../services/search.service";

function Search() {
  const [search, setSearch] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;

    try {
      const res = await searchService(search);
      if (!res.success) return toast.error(res.message);

      return;
    } catch (error) {
      return toast.error(error.response.data.error.message || error.message);
    }
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
