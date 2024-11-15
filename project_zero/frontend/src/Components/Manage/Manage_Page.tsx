import "./Manage_Page.css";

import { Schema, get_default_schema } from "../../Data/Schema";
import { export_schemas, import_schemas } from "../../Data/TransmitLib";

import ConfirmButton from "../Buttons/ConfirmButton";
import React from "react";

interface Manage_Page_Props {
  schemas: Schema[];
  set_selected_schema_id: (id: string) => void;
  set_myclasses: (schemas: Schema[]) => void;
}

// DAR - CHANGED PAGE

const Manage_Page: React.FC<Manage_Page_Props> = ({ schemas, set_selected_schema_id, set_myclasses }) => {
  // Add new schema
  const add_schema = () => {
    const new_schema: Schema = get_default_schema();
    set_myclasses([...schemas, new_schema]);
    set_selected_schema_id(new_schema.id);
  };

  const add_schemas = () => {
    let schema_list: any = [];

    for (var i = 0; i < 5; i++) {
      schema_list.push(get_default_schema());
    }
    set_myclasses([...schemas, ...schema_list]);
    set_selected_schema_id(schema_list[0].id);
  };

  const add_schema_1000 = () => {
    let schema_list: any = [];

    for (var i = 0; i < 1000; i++) {
      schema_list.push(get_default_schema());
    }
    set_myclasses([...schemas, ...schema_list]);
    set_selected_schema_id(schema_list[0].id);
  };

  return (
    <div className="manage-page-container">
      <h1>Import & Export</h1>
      <div className="manage-page-buttons">
        <ConfirmButton
          onConfirm={() => {
            let schemas: Schema[] | null = import_schemas();

            if (schemas != null) {
              set_myclasses(schemas);
            }
          }}
        >
          <button className="add-schema-btn">Import</button>
        </ConfirmButton>
        <button
          className="add-schema-btn"
          onClick={() => {
            // DAR TODO - Confirmation Modal before allowing export.
            export_schemas(schemas);
          }}
        >
          Export
        </button>
      </div>

      <h1>Mass Add Blank New Classes</h1>
      <div className="manage-page-buttons">
        <button className="add-schema-btn" onClick={add_schema}>
          Add Class
        </button>
        <button className="add-schema-btn" onClick={add_schemas}>
          Add Class x5
        </button>
        <button className="add-schema-btn" onClick={add_schema_1000}>
          Add Class x1000
        </button>
      </div>

      <h1>Delete All Classes</h1>
      <button className="add-schema-btn">Delete All Schemas (TODO) (make red)</button>
    </div>
  );
};

export default Manage_Page;
