import "./Pagination.css";

import React from "react";

interface PaginationProps {
  total_schemas: number;
  schemas_per_page: number;
  current_page: number;
  set_current_page: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ total_schemas: total_schemas, schemas_per_page: schemas_per_page, current_page: current_page, set_current_page: set_current_page }) => {
  const total_pages = Math.ceil(total_schemas / schemas_per_page);

  // Function to handle setting page safely within bounds
  const handle_set_page = (page: number) => {
    if (page < 1) {
      set_current_page(1);
    } else if (page > total_pages) {
      set_current_page(total_pages);
    } else {
      set_current_page(page);
    }
  };

  const get_minus_button = (val: number) => {
    return (
      <span className="left_button">
        <button onClick={() => handle_set_page(current_page - val)} disabled={current_page <= val} className={current_page <= val ? "disabled" : ""}>
          -{val}
        </button>
      </span>
    );
  };

  const get_plus_button = (val: number) => {
    return (
      <span className="right_button">
        <button onClick={() => handle_set_page(current_page + val)} disabled={current_page + val > total_pages} className={current_page + val > total_pages ? "disabled" : ""}>
          +{val}
        </button>
      </span>
    );
  };

  return (
    <div className="pagination">
      {/* Start of pagination objects */}

      {total_pages >= 100 && get_minus_button(100)}
      {total_pages >= 10 && get_minus_button(10)}
      {total_pages > 1 && get_minus_button(1)}

      <span className="page_span">
        Page {current_page} of {total_pages}
      </span>

      {total_pages > 1 && get_plus_button(1)}
      {total_pages >= 10 && get_plus_button(10)}
      {total_pages >= 100 && get_plus_button(100)}
    </div>
  );
};

export default Pagination;
