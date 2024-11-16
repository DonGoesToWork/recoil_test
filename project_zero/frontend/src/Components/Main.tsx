import "./main.css";

import React, { useEffect, useState } from "react";
import { Schema, Schema_Property, get_bee_farm_object, get_bee_hive_object, get_bee_object, get_farmer_object, get_inventory_schema as get_inventory_object, get_player_object, get_item_schema as get_rpg_item_schema } from "../Data/Schema";

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
  setOutputText: Function;
  selectedTab: number;
  schemas: Schema[];
  selectedSchema: Schema;
}

const update_output = (select_schema_data: Select_RpgClass_Props) => {
  const { setOutputText, selectedTab, schemas, selectedSchema } = select_schema_data;

  switch (selectedTab) {
    case 0:
      setOutputText(new Preview_Shared_DM_Lib(selectedSchema).final_content);
      break;
    case 1:
      setOutputText(new Preview_Front_DM_Lib(selectedSchema).final_content);
      break;
    case 2:
      setOutputText(new Preview_Back_DM_Lib(selectedSchema).final_content);
      break;
    case 3:
      setOutputText(new Preview_Singles_DM_Lib(schemas).final_content);
      break;
    case 4:
      setOutputText(new Preview_Global_Class_Map_Lib(schemas).finalContent);
      break;
    default:
      setOutputText("");
      break;
  }
};

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
  const [output_text, set_output_text] = useState<string>(new Preview_Shared_DM_Lib(schemas[0]).final_content);
  const [selected_tab, set_selected_tab] = useState<number>(0);
  const [current_page, set_current_page] = useState(1);
  const [third_column_view, set_third_column_view] = useState(4); // in prod, we use 5

  const { addToast: add_toast } = useToast();

  // Track the selected schema
  const selected_schema: Schema = schemas.find((schema) => schema.id === selected_schema_id) as Schema;

  // Effect to update output text when schemas, selectedTab, or selectedSchema change
  useEffect(() => {
    if (selected_schema) {
      update_output({
        setOutputText: set_output_text,
        selectedTab: selected_tab,
        schemas,
        selectedSchema: selected_schema,
      });
    }
  }, [schemas, selected_tab, selected_schema]);

  const update_schema = (field: string, value: string | boolean | Schema_Property[], selectedSchemaId: string): void => {
    if (selectedSchemaId !== null) {
      if (typeof value === "string") {
        let updated_value = value.replace(new RegExp(" ", "g"), "_");
        const updated_schemas = schemas.map((schema) => (schema.id === selectedSchemaId ? { ...schema, [field]: updated_value } : schema));
        set_schemas(updated_schemas);
      } else {
        const updated_schemas = schemas.map((schema) => (schema.id === selectedSchemaId ? { ...schema, [field]: value } : schema));
        set_schemas(updated_schemas);
      }
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

  let item1;
  let item2;
  let schemaList = (
    <div>
      <Schema_List schemas={schemas} selected_schema_id={selected_schema_id} set_selected_schema_id={set_selected_schema_id} set_myclasses={set_schemas} current_page={current_page} set_current_page={set_current_page} />
    </div>
  );
  let schemaForm = (
    <div>
      <Schema_Form selected_schema={selected_schema} update_schema={update_schema} delete_schema={delete_schema} />
    </div>
  );

  let thirdColumnCounter = 0;

  switch (third_column_view) {
    case thirdColumnCounter++:
      item1 = <div className="schemas-container-col-view2 my-card">{schemaList}</div>;
      item2 = <div className="schemas-container-col-view3 my-card">{schemaForm}</div>;
      break;
    case thirdColumnCounter++:
      item1 = (
        <div className="schemas-container-col-view my-card">
          <Manage_Page schemas={schemas} set_selected_schema_id={set_selected_schema_id} set_myclasses={set_schemas} />;
        </div>
      );
      break;
    case thirdColumnCounter++:
      item1 = (
        <div className="schemas-container-col-view my-card">
          <Snippet_Page schemas={schemas} selected_schema_id={selected_schema_id} />
        </div>
      );
      break;
    case thirdColumnCounter++:
      item1 = (
        <div className="schemas-container-col-view my-card">
          <h1>Preview</h1>
          <p>Show Data Preview Only</p>
          <Tabs selected_tab={selected_tab} handle_tab_change={handle_tab_change} />
          <textarea className="output-text" value={output_text} readOnly wrap="off" />
        </div>
      );
      break;
    case thirdColumnCounter++:
      item1 = (
        <div className="schemas-container-col-view my-card">
          <h1>Dev View 🧙🏼‍♂️🔥👏🏼⚡✨</h1>
          <div className="dev-view-grid">
            <div className="my-card">{schemaList}</div>
            <div className="my-card">{schemaForm}</div>
            <div className="my-card">
              <div className="output-container">
                <Tabs selected_tab={selected_tab} handle_tab_change={handle_tab_change} />
                <textarea className="output-text" value={output_text} readOnly wrap="off" />
              </div>
            </div>
            <div className="my-card">
              <Snippet_Page schemas={schemas} selected_schema_id={selected_schema_id} />
            </div>
          </div>
        </div>
      );
      break;
    case thirdColumnCounter++:
      item1 = (
        <div className="schemas-container-col-view2 my-card">
          <h1>Help</h1>
        </div>
      );
      break;
    case thirdColumnCounter++:
      item1 = (
        <div className="schemas-container-col-view my-card">
          <h1>About</h1>
          <p>Project Zero made by Donald Abdullah-Robinson for the purposes of evolving the web development ecosystem.</p>
          <p>Github: TODO</p>
        </div>
      );
      break;
    default:
      item1 = schemaForm;
      break;
  }

  return (
    <div>
      <header>
        <h1>ZER0</h1>
      </header>
      <span className="schemas-container">
        <Sidebar third_column_view={third_column_view} set_third_column_view={set_third_column_view} />
        {item1 !== undefined && item1}
        {item2 !== undefined && item2}
      </span>
    </div>
  );
};

export default App;
