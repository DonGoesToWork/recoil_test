// index.ts (back-end)

/***************************
 * Imports & Server Setup
 **************************/

import { createServer } from "http";
import express from "express";

const fs = require("node:fs");
var cors = require("cors");

const app = express();
const PORT = 5002;

app.use(cors({ origin: "*" }));
app.use(express.json()); // This middleware parses JSON in req.body

const server = createServer(app);

/*************************
 * Variables
 ************************/

const root_project_path = "E:\\Web Dev\\2024_Projects\\lootquest8\\";

let output_paths = {
  base: root_project_path + "\\generator_tool\\output\\",
  backend_data_model: root_project_path + "\\generator_tool\\output\\backend_data_models\\",
  frontend_data_model: root_project_path + "\\generator_tool\\output\\frontend_data_models\\",
  global_class_map: root_project_path + "\\generator_tool\\output\\global_class_map\\",
  shared_data_model: root_project_path + "\\generator_tool\\output\\shared_data_models\\",
  object_registration: root_project_path + "\\generator_tool\\output\\object_registration\\",
  notes: root_project_path + "\\generator_tool\\output\\note_data\\",
  output_static_shared: root_project_path + "\\generator_tool\\output_static_shared\\",
};

let main_project_paths = {
  frontend_data_models: root_project_path + "\\main_project\\frontend\\src\\z_generated\\Data_Models\\",
  frontend_data_models_shared: root_project_path + "\\main_project\\frontend\\src\\z_generated\\Shared_Data_Models\\",
  frontend_shared: root_project_path + "\\main_project\\frontend\\src\\z_generated\\Shared_Misc\\",

  backend_data_models: root_project_path + "\\main_project\\backend\\src\\z_generated\\Data_Models\\",
  backend_data_models_shared: root_project_path + "\\main_project\\backend\\src\\z_generated\\Shared_Data_Models\\",
  backend_shared: root_project_path + "\\main_project\\backend\\src\\z_generated\\Shared_Misc\\",
  backend_global_class_map: root_project_path + "\\main_project\\backend\\src\\z_generated\\Global_Class_Map\\",

  object_registration_file: root_project_path + "\\main_project\\backend\\src\\",
};

/*************************
 * TYPES
 ************************/

const state: Client_Message = {
  // Main state object
  object_file_data: [],
  object_registration_contents: "",
  global_class_map_contents: "",
  notes: [],
};

// Define a type for the Note structure
export type Note = {
  id: string;
  object_name: string;
  parent: string;
  child_list: string;
  property_list: string;
  date: string; // Add a date field
};

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

let ensure_exists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

let create_folders = () => {
  for (const [key, value] of Object.entries(output_paths)) {
    ensure_exists(value);
  }
};

create_folders();

// Recieve and handle '/import' requests.
app.get("/import", (req, res) => {
  console.log("Recieved import command.");

  // Send notes to requestor.
  res.send(JSON.stringify(state.notes));
});

function copy_folder_to_folder(folder1: string, folder2: string) {
  fs.readdir(folder1, (err: any, files: any[]) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((file) => {
        fs.copyFile(folder1 + file, folder2 + file, (err: any) => {
          if (err) {
            console.error(err);
          }
        });
      });
    }
  });
}

function write_file(res: any, file_path: string, contents: string) {
  fs.writeFile(file_path, contents, (err: any) => {
    if (err) {
      console.error(err);
      res.sendStatus(500); // return fail error code 500 to client.
    }
  });
}

// Recieve and handle '/export' requests.
app.post("/export", (req, res) => {
  console.log("Recieved export command.");

  // Store every property in req.body into our state object.
  for (const [key, value] of Object.entries(req.body as Client_Message) as [keyof Client_Message, Client_Message[keyof Client_Message]][]) {
    state[key] = value as any;
  }

  // * Delete current output folder.

  if (fs.existsSync(output_paths.base)) {
    fs.rmSync(output_paths.base, { recursive: true, force: true });
  }

  create_folders(); // recreate empty folders.

  // * Write every state item to file.

  // Write all of the main objects to .ts files.

  state.object_file_data.forEach((item) => {
    write_file(res, output_paths.backend_data_model + item.object_name + ".ts", item.backend_data_model);
    write_file(res, output_paths.frontend_data_model + item.object_name + ".ts", item.frontend_data_model);
    write_file(res, output_paths.shared_data_model + item.object_name + ".ts", item.shared_data_model);
  });

  write_file(res, output_paths.global_class_map + "/Global_Class_Map.ts", state.global_class_map_contents);
  write_file(res, output_paths.object_registration + "/Object_Registration.ts", state.object_registration_contents);
  write_file(res, output_paths.notes + "/notes.ts", JSON.stringify(state.notes));

  // * Move all files to their relevant locations within the frontend and backend folders one-level down from project root.

  // Clear generated folders.
  fs.rmSync(root_project_path + "\\main_project\\frontend\\src\\z_generated", { recursive: true, force: true });
  fs.rmSync(root_project_path + "\\main_project\\backend\\src\\z_generated", { recursive: true, force: true });

  ensure_exists(main_project_paths.backend_data_models);
  copy_folder_to_folder(output_paths.backend_data_model, main_project_paths.backend_data_models);

  ensure_exists(main_project_paths.frontend_data_models);
  copy_folder_to_folder(output_paths.frontend_data_model, main_project_paths.frontend_data_models);

  ensure_exists(main_project_paths.backend_global_class_map);
  copy_folder_to_folder(output_paths.global_class_map, main_project_paths.backend_global_class_map);

  ensure_exists(main_project_paths.frontend_data_models_shared);
  copy_folder_to_folder(output_paths.shared_data_model, main_project_paths.frontend_data_models_shared);

  ensure_exists(main_project_paths.backend_data_models_shared);
  copy_folder_to_folder(output_paths.shared_data_model, main_project_paths.backend_data_models_shared);

  ensure_exists(main_project_paths.frontend_shared);
  copy_folder_to_folder(output_paths.output_static_shared, main_project_paths.frontend_shared);

  ensure_exists(main_project_paths.backend_shared);
  copy_folder_to_folder(output_paths.output_static_shared, main_project_paths.backend_shared);

  // Copy object registration last.
  copy_folder_to_folder(output_paths.object_registration, main_project_paths.object_registration_file);

  // All files written successfully, send success return code to client with 200.
  res.sendStatus(200);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is loading existing class objects from files.`);

  // Load Note Data from files in notes_output_path.
  fs.readdir(output_paths.notes, (err: any, files: any[]) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((file) => {
        fs.readFile(output_paths.notes + file, "UTF-8", (err: any, data: any) => {
          if (err) {
            console.error(err);
          } else {
            state.notes.push(JSON.parse(data));
          }
        });
      });
    }
  });

  console.log(`Succcessfully completed loading class objects from files.`);
});
