import "./Schema_List.css";

import React, { useMemo, useState } from "react";
import { Schema, get_default_schema } from "../../Data/Schema";

import Pagination from "./Pagination";
import Schema_Grid from "./Schema_Grid";
import Search_Bar from "./Search_Bar";
import { export_schemas } from "../../Data/TransmitLib";
import { schemas_per_page } from "./Schemas_Per_Page";

interface Schema_List_Props {
  schemas: Schema[];
  selected_schema_id: string | null;
  set_selected_schema_id: (id: string) => void;
  set_myclasses: (schemas: Schema[]) => void;
  current_page: number;
  set_current_page: (page: number) => void;
}

const Schema_List: React.FC<Schema_List_Props> = ({ schemas, selected_schema_id, set_selected_schema_id, set_myclasses, current_page, set_current_page }) => {
  const [search_query, set_search_query] = useState("");

  const add_schema = () => {
    const newSchema: Schema = get_default_schema();
    set_myclasses([...schemas, newSchema]);
    set_selected_schema_id(newSchema.id);
    let finalPage = Math.floor(schemas.length / 9) + 1;

    // Always advance to final page when not on it.
    if (current_page != finalPage) {
      set_current_page(finalPage);
    }
  };

  // Filter schemas based on the search query
  const filtered_schemas = useMemo(() => {
    return schemas.filter((schema) => schema.object_name.toLowerCase().includes(search_query.toLowerCase()));
  }, [schemas, search_query]);

  // Pagination: Calculate the schemas for the current page
  const paginated_schemas = useMemo(() => {
    const start = (current_page - 1) * schemas_per_page;
    return filtered_schemas.slice(start, start + schemas_per_page);
  }, [filtered_schemas, current_page]);

  return (
    <div className="schemas-list-container">
      <div className="schemas-list-container-buttons">
        <button className="add-schema-btn" onClick={add_schema}>
          📝 Add New
        </button>
        <button
          className="add-schema-btn"
          onClick={() => {
            // DAR TODO - Confirmation Modal before allowing export.
            export_schemas(schemas);
          }}
        >
          📂 Export
        </button>
      </div>
      <Search_Bar search_query={search_query} set_search_query={set_search_query} />

      <Schema_Grid schemas={paginated_schemas} selected_schema_id={selected_schema_id} set_selected_schema_id={set_selected_schema_id} />

      <Pagination total_schemas={filtered_schemas.length} schemas_per_page={schemas_per_page} current_page={current_page} set_current_page={set_current_page} />
    </div>
  );
};

export default Schema_List;
