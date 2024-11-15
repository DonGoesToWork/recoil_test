import React from "react";

//import './SearchBar.css';

interface Search_Bar_Props {
  search_query: string;
  set_search_query: (query: string) => void;
}

const Search_Bar: React.FC<Search_Bar_Props> = ({ search_query, set_search_query }) => {
  return <input type="text" placeholder="Search schemas by title..." value={search_query} onChange={(e) => set_search_query(e.target.value)} className="search-bar" />;
};

export default Search_Bar;
