import React from "react";

//import './SearchBar.css';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return <input type="text" placeholder="Search notes by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-bar" />;
};

export default SearchBar;
