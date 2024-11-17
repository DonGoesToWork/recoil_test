import "./Schema_Grid.css";

import React from "react";
import { Schema } from "../../Data/Schema";

interface Schema_Grid_Props {
  schemas: Schema[];
  selected_schema_id: string | null;
  set_selected_schema_id: (id: string) => void;
}

const line_length_max = 18;

const truncated = (content: string): string => (content.length > line_length_max ? content.substring(0, line_length_max).split("\n").join(", ") + "..." : content);

const Schema_Grid: React.FC<Schema_Grid_Props> = ({ schemas, selected_schema_id: selectedSchemaId, set_selected_schema_id }) => {
  return (
    <div className="schema-grid">
      {schemas.map((schema) => (
        <div
          key={schema.id}
          className={`schema-item ${schema.id === selectedSchemaId ? "selected" : ""}`}
          onClick={() => {
            set_selected_schema_id(schema.id);
          }}
        >
          <div className="schema-title-preview">{schema.object_name}</div>
          <div className="schema-preview">{truncated("PA: " + schema.parent)}</div>
          <div className="schema-preview">{truncated("CH: " + `${schema.child_list.map((child) => child.name)}`)}</div>
          <div className="schema-preview">{truncated("PR: " + `${schema.property_list.map((property) => property.name)}`)}</div>
          {/* TODO ADD INTERFACE FUNCTIONS HERE */}
          <div className="schema-date-preview">{schema.date}</div>
        </div>
      ))}
    </div>
  );
};

export default Schema_Grid;
