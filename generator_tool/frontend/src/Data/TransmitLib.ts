// Handle note import functionality.

import { Note } from "./Note";
import Preview_Back_DM_Lib from "./Preview_Back_DM_Lib";
import Preview_Front_DM_Lib from "./Preview_Front_DM_Lib";
import Preview_Global_Class_Map_Lib from "./Preview_Global_Class_Map";
import Preview_Object_Registration_DM_Lib from "./Preview_Object_Registration_DM_Lib";
import Preview_Shared_DM_Lib from "./Preview_Shared_DM_Lib";

interface Client_Message {
  object_file_data: Object_File_Data[];
  object_registration_contents: string;
  global_class_map_contents: string;
  notes: Note[];
}

interface Object_File_Data {
  object_name: string;
  backend_data_model: string;
  frontend_data_model: string;
  shared_data_model: string;
}

//  ".json"

// Handle note import functionality.
export const importNotes = (): Note[] | null => {
  // Use fetch to 'GET' notes to back-end service.
  fetch("http://localhost:5002/import")
    .then((response: any) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // On response code 200, shoot out a success toast message.
      let res_json: Client_Message = response.json();

      return res_json.notes;
    })
    .then((data: any) => {
      console.log(data); // Handle the response data
    })
    .catch((error: any) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  return null;
};

// Handle note export functionality.
export const exportNotes = (notes: Note[]) => {
  let export_data: Client_Message = {
    object_file_data: notes.map((note: Note) => ({
      object_name: note.object_name,
      backend_data_model: new Preview_Back_DM_Lib(note).finalContent,
      frontend_data_model: new Preview_Front_DM_Lib(note).finalContent,
      shared_data_model: new Preview_Shared_DM_Lib(note).finalContent,
    })),
    object_registration_contents: new Preview_Object_Registration_DM_Lib(notes).finalContent,
    global_class_map_contents: new Preview_Global_Class_Map_Lib(notes).finalContent,
    notes: notes,
  };

  console.log(export_data);

  // Use fetch to 'POST' notes to back-end service.
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
