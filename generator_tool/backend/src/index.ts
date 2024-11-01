// index.ts (back-end)

import { createServer } from "http";
import express from "express";

const fs = require("node:fs");
var cors = require("cors");

const app = express();
const PORT = 5002;

app.use(cors({ origin: "*" }));
app.use(express.json()); // This middleware parses JSON in req.body

const server = createServer(app);

// Create Variables
const root_project_path = "E:\\Web Dev\\2024_Projects\\recoil_test";

let output_paths = {
  base: root_project_path + "\\generator_tool\\output\\",
  backend_data_model: root_project_path + "\\generator_tool\\output\\backend_data_models\\",
  frontend_data_model: root_project_path + "\\generator_tool\\output\\frontend_data_models\\",
  shared_data_model: root_project_path + "\\generator_tool\\output\\shared_data_models\\",
  object_registration: root_project_path + "\\generator_tool\\output\\object_registration_file\\",
  notes: root_project_path + "\\generator_tool\\output\\note_data\\",
  output_static_shared: root_project_path + "\\generator_tool\\output_static_shared\\",
};

const state: Client_Message = {
  // Main state object
  object_file_data: [],
  object_registration_contents: "",
  notes: [],
};

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

/*******************
 * TYPES
 ******************/

// Define a type for the Note structure
export type Note = {
  id: string;
  object_name: string;
  parent: string;
  child_list: string;
  user_property_list: string;
  property_list: string;
  date: string; // Add a date field
};

interface Client_Message {
  object_file_data: Object_File_Data[];
  object_registration_contents: string;
  notes: Note[];
}

interface Object_File_Data {
  object_name: string;
  backend_data_model: string;
  frontend_data_model: string;
  shared_data_model: string;
}

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

// Recieve and handle '/export' requests.
app.post("/export", (req, res) => {
  console.log("Recieved export command.");

  // Recieve full client state and store in our state object.
  const client_message: Client_Message = req.body;

  state.object_file_data = client_message.object_file_data;
  state.object_registration_contents = client_message.object_registration_contents;
  state.notes = client_message.notes;

  // * Delete current output folder.

  if (fs.existsSync(output_paths.base)) {
    fs.rmSync(output_paths.base, { recursive: true, force: true });
  }

  create_folders(); // recreate empty folders.

  // * Write every state item to file.

  // Write all of the main objects to .ts files.
  state.object_file_data.forEach((item) => {
    // write backend data model
    fs.writeFile(output_paths.backend_data_model + item.object_name + ".ts", item.backend_data_model, (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });

    // write front-end data model.
    fs.writeFile(output_paths.frontend_data_model + item.object_name + ".ts", item.frontend_data_model, (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });

    // write shared data model.
    fs.writeFile(output_paths.shared_data_model + item.object_name + ".ts", item.shared_data_model, (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });
  });

  // Write Object Registration file to .ts file.
  fs.writeFile(output_paths.object_registration + "/Object_Registration.ts", state.object_registration_contents, (err: any) => {
    if (err) {
      console.error(err);
      res.sendStatus(500); // return fail error code 500 to client.
    }
  });

  // Write our notes contents to a .ts file.
  fs.writeFile(output_paths.notes + "/notes.ts", JSON.stringify(state.notes), (err: any) => {
    if (err) {
      console.error(err);
      res.sendStatus(500); // return fail error code 500 to client.
    }
  });

  // * Move all files to their relevant locations within the frontend and backend folders one-level down from project root.

  let frontend_data_models_path = root_project_path + "\\frontend\\src\\z_generated\\Data_Models\\";
  let frontend_dm_shared_files_path = root_project_path + "\\frontend\\src\\z_generated\\Shared_Data_Models\\";
  let frontend_shared_files_path = root_project_path + "\\frontend\\src\\z_generated\\Shared_Misc\\";

  let backend_data_models_path = root_project_path + "\\backend\\src\\z_generated\\Data_Models\\";
  let backend_dm_shared_files_path = root_project_path + "\\backend\\src\\z_generated\\Shared_Data_Models\\";
  let backend_shared_files_path = root_project_path + "\\backend\\src\\z_generated\\Shared_Misc\\";

  let object_registration_file_path = root_project_path + "\\backend\\src\\";

  // Clear generated folders.
  fs.rmSync(root_project_path + "\\frontend\\src\\z_generated", { recursive: true, force: true });
  fs.rmSync(root_project_path + "\\backend\\src\\z_generated", { recursive: true, force: true });

  ensure_exists(backend_data_models_path);
  copy_folder_to_folder(output_paths.backend_data_model, backend_data_models_path);

  ensure_exists(frontend_data_models_path);
  copy_folder_to_folder(output_paths.frontend_data_model, frontend_data_models_path);

  ensure_exists(frontend_dm_shared_files_path);
  copy_folder_to_folder(output_paths.shared_data_model, frontend_dm_shared_files_path);

  ensure_exists(backend_dm_shared_files_path);
  copy_folder_to_folder(output_paths.shared_data_model, backend_dm_shared_files_path);

  ensure_exists(frontend_shared_files_path);
  copy_folder_to_folder(output_paths.output_static_shared, frontend_shared_files_path);

  ensure_exists(backend_shared_files_path);
  copy_folder_to_folder(output_paths.output_static_shared, backend_shared_files_path);

  // Copy object registration last.
  copy_folder_to_folder(output_paths.object_registration, object_registration_file_path);

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

// fs.readdir(output_path, (err: any, files: any[]) => {
//   if (err) {
//     console.error(err);
//   } else {
//     files.forEach((file) => {
//       fs.readFile(output_path + file, "UTF-8", (err: any, data: any) => {
//         if (err) {
//           console.error(err);
//         } else {
//           state.push({ file_name: file, file_content: data });
//         }
//       });
//     });
//   }
// });
