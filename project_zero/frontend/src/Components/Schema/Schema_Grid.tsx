import "./Schema_Grid.css";

import React from "react";
import { Schema } from "../../Data/Schema";

interface SchemaGridProps {
  schemas: Schema[];
  selected_schema_id: string | null;
  set_selected_schema_id: (id: string) => void;
}

const line_length_max = 15;

const truncated = (content: string): string => (content.length > line_length_max ? content.substring(0, line_length_max).split("\n").join(", ") + "..." : content);

const SchemaGrid: React.FC<SchemaGridProps> = ({ schemas, selected_schema_id: selectedSchemaId, set_selected_schema_id }) => {
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
          <div className="schema-preview">{truncated("- " + schema.parent)}</div>
          <div className="schema-preview">{truncated("- " + schema.child_list)}</div>
          <div className="schema-preview">{truncated("- " + schema.property_list)}</div>
          <div className="schema-date-preview">{schema.date}</div>
        </div>
      ))}
    </div>
  );
};

export default SchemaGrid;
