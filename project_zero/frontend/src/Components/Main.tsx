import "./Main.css";

import { Child_Schema, Schema, Schema_Property, User_Interaction, get_bee_farm_object, get_bee_hive_object, get_bee_object, get_farmer_object, get_inventory_schema as get_inventory_object, get_player_object, get_item_schema as get_rpg_item_schema } from "../Data/Schema";
import React, { useEffect, useState } from "react";

import Manage_Page from "./Manage/Manage_Page";
import Preview_Back_DM_Lib from "../Data/Preview_Back_DM_Lib";
import Preview_Front_DM_Lib from "../Data/Preview_Front_DM_Lib";
import Preview_Global_Class_Map_Lib from "../Data/Preview_Global_Class_Map";
import Preview_Shared_DM_Lib from "../Data/Preview_Shared_DM_Lib";
import Preview_Singles_DM_Lib from "../Data/Preview_Object_Registration_DM_Lib";
import Schema_Form from "./Schema_Entry/Schema_Form";
import Schema_List from "./Schema/Schema_List";
import Sidebar from "./Sidebar/Sidebar";
import Snippet_Page from "./Snippets/SnippetPage";
import Tabs from "./Tabs";
import { generate_unique_id } from "../Utils/utils";
import { schemas_per_page } from "./Schema/Schemas_Per_Page";
import { useToast } from "./Toast/ToastContainer";

export interface Select_RpgClass_Props {
  set_output_text: Function;
  selected_tab: number;
  schemas: Schema[];
  selected_schema: Schema;
}

const update_output = (select_schema_data: Select_RpgClass_Props) => {
  const { set_output_text, selected_tab, schemas, selected_schema } = select_schema_data;

  switch (selected_tab) {
    case 0:
      set_output_text(new Preview_Shared_DM_Lib(selected_schema, schemas, true).final_content);
      break;
    case 1:
      set_output_text(new Preview_Front_DM_Lib(selected_schema, schemas, true).final_content);
      break;
    case 2:
      set_output_text(new Preview_Back_DM_Lib(selected_schema, schemas, true).final_content);
      break;
    case 3:
      set_output_text(new Preview_Singles_DM_Lib(schemas, true).final_content);
      break;
    case 4:
      set_output_text(new Preview_Global_Class_Map_Lib(schemas, true).finalContent);
      break;
    default:
      set_output_text("");
      break;
  }
};

export type Update_Schema_Params = string | boolean | Schema_Property[] | Child_Schema[] | User_Interaction[];

const App: React.FC = () => {
  const firstId = generate_unique_id();

  const [schemas, set_schemas] = useState<Schema[]>([
    get_bee_object(firstId),
    get_bee_hive_object(generate_unique_id()),
    get_bee_farm_object(generate_unique_id()),
    get_farmer_object(generate_unique_id()),
    get_player_object(generate_unique_id()),
    get_inventory_object(generate_unique_id()),
    get_rpg_item_schema(generate_unique_id()),
  ]);
  const [selected_schema_id, set_selected_schema_id] = useState<string>(firstId);
  const [output_text, set_output_text] = useState<string>(new Preview_Shared_DM_Lib(schemas[0], schemas).final_content);
  const [selected_tab, set_selected_tab] = useState<number>(0);
  const [current_page, set_current_page] = useState(1);
  const [third_column_view, set_third_column_view] = useState(5); // in prod, we use 6

  const { add_toast: add_toast } = useToast();

  // Track the selected schema
  const selected_schema: Schema = schemas.find((schema) => schema.id === selected_schema_id) as Schema;

  // Effect to update output text when schemas, selectedTab, or selectedSchema change
  useEffect(() => {
    if (selected_schema) {
      update_output({
        set_output_text: set_output_text,
        selected_tab: selected_tab,
        schemas,
        selected_schema: selected_schema,
      });
    }
  }, [schemas, selected_tab, selected_schema]);

  const update_schema = (field: string, value: Update_Schema_Params, selected_schema_id: string): void => {
    if (selected_schema_id !== null) {
      const updated_schemas = schemas.map((schema) => (schema.id === selected_schema_id ? { ...schema, [field]: value } : schema));
      set_schemas(updated_schemas);
    }
  };

  const delete_schema = (): boolean => {
    if (schemas.length === 1) {
      add_toast("Error: Unable to delete final object.", "error", 5000);
      console.log("Can't delete last object.");
      return false;
    }

    // get index of selectedSchema to select the schema before it on delete...
    const filtered_schemas = schemas.filter((schema) => schema.id !== selected_schema_id);
    let remove_schema_index = schemas.findIndex((schema) => schema.id === selected_schema_id);
    let set_selected_schema_idIndex = remove_schema_index - 1;

    if (set_selected_schema_idIndex < 0) {
      // cap at 0.
      set_selected_schema_idIndex = 0;
    }

    set_selected_schema_id(filtered_schemas[set_selected_schema_idIndex].id);
    set_schemas(filtered_schemas);

    // Decrement page whenever we delete the last schema of a page (excluding the first page).
    if (current_page == Math.ceil(schemas.length / schemas_per_page) && schemas.length % schemas_per_page == 1) {
      set_current_page(current_page - 1);
    }

    return true;
  };

  const handle_tab_change = (tabIndex: number) => {
    set_selected_tab(tabIndex);
  };

  let item_1;
  let item_2;
  let schema_list = (
    <div>
      <Schema_List schemas={schemas} selected_schema_id={selected_schema_id} set_selected_schema_id={set_selected_schema_id} set_myclasses={set_schemas} current_page={current_page} set_current_page={set_current_page} />
    </div>
  );
  let schema_form = (
    <div>
      <Schema_Form selected_schema={selected_schema} update_schema={update_schema} delete_schema={delete_schema} />
    </div>
  );

  let third_column_counter = 0;

  switch (third_column_view) {
    case third_column_counter++:
      item_1 = <div className="schemas-container-col-view2 my-card">{schema_list}</div>;
      item_2 = <div className="schemas-container-col-view3 my-card">{schema_form}</div>;
      break;
    case third_column_counter++:
      item_1 = (
        <div className="schemas-container-col-view my-card">
          <Manage_Page schemas={schemas} set_selected_schema_id={set_selected_schema_id} set_myclasses={set_schemas} />
        </div>
      );
      break;
    case third_column_counter++:
      item_1 = (
        <div className="schemas-container-col-view my-card">
          <Snippet_Page schemas={schemas} selected_schema_id={selected_schema_id} />
        </div>
      );
      break;
    case third_column_counter++:
      item_1 = (
        <div className="schemas-container-col-view my-card">
          <h1>Preview</h1>
          <p>Show Data Preview Only</p>
          <Tabs selected_tab={selected_tab} handle_tab_change={handle_tab_change} />
          <textarea className="output-text" value={output_text} readOnly wrap="off" />
        </div>
      );
      break;
    case third_column_counter++:
      item_1 = (
        <div className="schemas-container-col-view my-card">
          <h1>Validation</h1>
          <p>See invalid schema configuration errors.</p>
          <p>Todo</p>
        </div>
      );
      break;
    case third_column_counter++:
      item_1 = (
        <div className="schemas-container-col-view my-card">
          <h1>Dev View 🧙🏼‍♂️🔥👏🏼⚡✨</h1>
          <div className="dev-view-grid">
            <div className="my-card">{schema_list}</div>
            <div className="my-card">{schema_form}</div>
            <div className="my-card">
              <div className="output-container">
                <Tabs selected_tab={selected_tab} handle_tab_change={handle_tab_change} />
                <textarea className="output-text" value={output_text} readOnly wrap="off" />
              </div>
            </div>
          </div>
          <div className="my-card">
            <Snippet_Page schemas={schemas} selected_schema_id={selected_schema_id} />
          </div>
        </div>
      );
      break;
    case third_column_counter++:
      item_1 = (
        <div className="schemas-container-col-view2 my-card">
          <h1>Help</h1>
        </div>
      );
      break;
    case third_column_counter++:
      item_1 = (
        <div className="schemas-container-col-view my-card">
          <h1>About</h1>
          <p>Project Zero made by Donald Abdullah-Robinson for the purposes of evolving the web development ecosystem.</p>
          <p>Github: TODO</p>
        </div>
      );
      break;
    default:
      item_1 = schema_form;
      break;
  }

  return (
    <div className="main-body">
      <div className="main-body-container">
        <div className="main-body-container-header">
          <header>
            <h1>ZER0</h1>
          </header>
        </div>
        <div className="schemas-container">
          <Sidebar third_column_view={third_column_view} set_third_column_view={set_third_column_view} />
          {item_1 !== undefined && item_1}
          {item_2 !== undefined && item_2}
        </div>
      </div>
    </div>
  );
};

export default App;
