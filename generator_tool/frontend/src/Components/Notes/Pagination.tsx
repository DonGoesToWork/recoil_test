import React from 'react';
import './Pagination.css';

interface PaginationProps {
  totalNotes: number;
  notesPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalNotes,
  notesPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalNotes / notesPerPage);

  // Function to handle setting page safely within bounds
  const handleSetPage = (page: number) => {
    if (page < 1) {
      setCurrentPage(1);
    } else if (page > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(page);
    }
  };

  const get_minus_button = (val: number) => {
    return (
      <span className="left_button">
        <button
          onClick={() => handleSetPage(currentPage - val)}
          disabled={currentPage <= val}
          className={currentPage <= val ? 'disabled' : ''}
        >
          -{val}
        </button>
      </span>
    );
  };

  const get_plus_button = (val: number) => {
    return (
      <span className="right_button">
        <button
          onClick={() => handleSetPage(currentPage + val)}
          disabled={currentPage + val > totalPages}
          className={currentPage + val > totalPages ? 'disabled' : ''}
        >
          +{val}
        </button>
      </span>
    );
  };

  return (
    <div className="pagination">
      {/* Start of pagination objects */}

      {totalPages >= 100 && get_minus_button(100)}
      {totalPages >= 10 && get_minus_button(10)}
      {totalPages > 1 && get_minus_button(1)}

      <span className="page_span">
        Page {currentPage} of {totalPages}
      </span>

      {totalPages > 1 && get_plus_button(1)}
      {totalPages >= 10 && get_plus_button(10)}
      {totalPages >= 100 && get_plus_button(100)}
    </div>
  );
};

export default Pagination;
