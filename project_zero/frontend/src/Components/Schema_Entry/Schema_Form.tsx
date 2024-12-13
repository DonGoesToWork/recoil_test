import "./Schema_Form.css";

import Child_List_Config from "./Child_List_Config";
import Member_List_Config from "./Member_List_Config";
import Property_List_Config from "./Property_List_Config";
import React from "react";
import { Schema } from "../../Data/Schema";
import { Update_Schema_Params } from "../Main";
import User_Interactions_Config from "./User_Interactions_Config";

interface Schema_Form_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: Update_Schema_Params, selected_schema_id: string) => void;
  delete_schema: () => void;
}

const Schema_Form: React.FC<Schema_Form_Props> = ({ selected_schema, update_schema, delete_schema }) => {
  return (
    <div className="schema-view">
      <label>Class Name</label>
      <h3>The name of this object's class. The object's name.</h3>
      <input
        className="schema-title"
        value={selected_schema.object_name}
        onChange={(e) => update_schema("object_name", e.target.value, selected_schema.id)}
        placeholder="Schema Title"
      />

      <hr />
      <label>Generate IA Create Function</label>
      <h3>Create the interaction (ia = Inter-Action) for creating new objects from schema?</h3>
      <span style={{ marginBottom: "10px" }}>
        <input
          type="checkbox"
          checked={selected_schema.do_gen_ia_create_new}
          onClick={() => update_schema("do_gen_ia_create_new", !selected_schema.do_gen_ia_create_new, selected_schema.id)}
          onChange={() => {}}
        />
      </span>

      <hr />
      <Member_List_Config selected_schema={selected_schema} update_schema={update_schema} />

      <hr />
      <Child_List_Config selected_schema={selected_schema} update_schema={update_schema} />

      <hr />
      <Property_List_Config selected_schema={selected_schema} update_schema={update_schema} />

      <hr />
      <User_Interactions_Config selected_schema={selected_schema} update_schema={update_schema} />

      <hr />
      <label>Date</label>
      <h3>Date object was added. (or edited, if you modify the field...)</h3>
      <input className="schema-date" type="date" value={selected_schema?.date || ""} onChange={(e) => update_schema("date", e.target.value, selected_schema.id)} />

      <hr />
      <button className="delete-schema-btn" onClick={delete_schema}>
        Delete Schema
      </button>
    </div>
  );
};

export default Schema_Form;
