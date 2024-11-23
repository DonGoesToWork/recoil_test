// Handle schema import functionality.

import Preview_Back_DM_Lib from "./Preview_Back_DM_Lib";
import Preview_Front_DM_Lib from "./Preview_Front_DM_Lib";
import Preview_Global_Class_Map_Lib from "./Preview_Global_Class_Map";
import Preview_Object_Registration_DM_Lib from "./Preview_Object_Registration_DM_Lib";
import Preview_Shared_DM_Lib from "./Preview_Shared_DM_Lib";
import { Schema } from "./Schema";
import { fix_schemas } from "./Schema_Lib";

interface Client_Message {
  object_file_data: Object_File_Data[];
  object_registration_contents: string;
  global_class_map_contents: string;
  schemas: Schema[];
}

interface Object_File_Data {
  object_name: string;
  backend_data_model: string;
  frontend_data_model: string;
  shared_data_model: string;
}

//  ".json"

// Handle schema import functionality.
export const import_schemas = (): Schema[] | null => {
  // Use fetch to 'GET' schemas to back-end service.
  fetch("http://localhost:5002/import")
    .then((response: any) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // On response code 200, shoot out a success toast message.
      let res_json: Client_Message = response.json();

      return res_json.schemas;
    })
    .then((data: any) => {
      console.log(data); // Handle the response data
    })
    .catch((error: any) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  return null;
};

// Handle schema export functionality.
export const export_schemas = (schemas: Schema[]) => {
  // Fix schemas manually so that we only do it once (and not many times repeatedly).
  schemas = fix_schemas(schemas);

  let export_data: Client_Message = {
    object_file_data: schemas.map((schema: Schema) => ({
      object_name: schema.object_name,
      backend_data_model: new Preview_Back_DM_Lib(schema, schemas, false).final_content,
      frontend_data_model: new Preview_Front_DM_Lib(schema, schemas, false).final_content,
      shared_data_model: new Preview_Shared_DM_Lib(schema, schemas, false).final_content,
    })),
    object_registration_contents: new Preview_Object_Registration_DM_Lib(schemas, false).final_content,
    global_class_map_contents: new Preview_Global_Class_Map_Lib(schemas, false).finalContent,
    schemas: schemas,
  };

  console.log(export_data);

  // Use fetch to 'POST' schemas to back-end service.
  fetch("http://localhost:5002/export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(export_data),
  })
    .then((response: any) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // On response code 200, shoot out a success toast message.
      return response.json(); // Assuming the API returns JSON data
    })
    .then((data: any) => {
      console.log(data); // Handle the response data
    })
    .catch((error: any) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  return "";
};
