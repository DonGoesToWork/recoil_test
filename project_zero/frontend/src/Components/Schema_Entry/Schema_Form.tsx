import "./Schema_Form.css";

import { Schema, Schema_Property } from "../../Data/Schema";

import Property_List from "./Property_List";
import React from "react";

interface Schema_Form_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: string | Schema_Property[], selected_schema_id: string) => void;
  delete_schema: () => void;
}

const Schema_Form: React.FC<Schema_Form_Props> = ({ selected_schema, update_schema, delete_schema }) => {
  return (
    <div className="schema-view">
      <label>Class Name</label>
      <input className="schema-title" value={selected_schema.object_name} onChange={(e) => update_schema("object_name", e.target.value, selected_schema.id)} placeholder="Schema Title" />
      <h3>The name of this object's class. The object's name.</h3>

      <label>Parent Name</label>
      <h3>Object that includes this object.</h3>
      <input className="schema-title" value={selected_schema.parent} onChange={(e) => update_schema("parent", e.target.value, selected_schema.id)} placeholder="Parent Object" />

      <label>Child Name List</label>
      <h3>Objects that this object logically includes.</h3>
      <textarea className="schema-content small" value={selected_schema.child_list} onChange={(e) => update_schema("child_list", e.target.value, selected_schema.id)} placeholder="Write one (1) child object per line..." />

      <Property_List selected_schema={selected_schema} update_schema={update_schema} />

      <label>Date</label>
      <h3>Date object was added. (or edited, if you modify the field...)</h3>
      <input className="schema-date" type="date" value={selected_schema?.date || ""} onChange={(e) => update_schema("date", e.target.value, selected_schema.id)} />

      <button className="delete-schema-btn" onClick={delete_schema}>
        Delete Class
      </button>
    </div>
  );
};

export default Schema_Form;
