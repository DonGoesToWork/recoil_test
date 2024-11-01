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
const output_path = root_project_path + "\\generator_tool\\output\\";

const backend_data_model_output_path = root_project_path + "\\generator_tool\\output\\backend_data_models\\";
const frontend_data_model_output_path = root_project_path + "\\generator_tool\\output\\frontend_data_models\\";
const shared_data_model_output_path = root_project_path + "\\generator_tool\\output\\shared_data_models\\";

const object_registration_output_path = root_project_path + "\\generator_tool\\output\\object_registration_file\\";

const notes_output_path = root_project_path + "\\generator_tool\\output\\note_data\\";

const output_static_shared_path = root_project_path + "\\generator_tool\\output\\output_static_shared\\";

const state: Client_Message = {
  // Main state object
  object_file_data: [],
  object_registration_contents: "",
  notes: [],
};

let ensure_exists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

let create_folders = () => {
  ensure_exists(output_path);
  ensure_exists(backend_data_model_output_path);
  ensure_exists(frontend_data_model_output_path);
  ensure_exists(shared_data_model_output_path);
  ensure_exists(object_registration_output_path);
  ensure_exists(notes_output_path);
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

// Recieve and handle '/export' requests.
app.post("/export", (req, res) => {
  console.log("Recieved export command.");

  // Recieve full client state and store in our state object.
  const client_message: Client_Message = req.body;

  state.object_file_data = client_message.object_file_data;
  state.object_registration_contents = client_message.object_registration_contents;
  state.notes = client_message.notes;

  // * Delete current output folder.

  if (fs.existsSync(output_path)) {
    fs.rmSync(output_path, { recursive: true, force: true });
  }

  create_folders(); // recreate empty folders.

  // * Write every state item to file.

  // Write all of the main objects to .ts files.
  state.object_file_data.forEach((item) => {
    // write backend data model
    fs.writeFile(backend_data_model_output_path + item.object_name + ".ts", item.backend_data_model, (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });

    // write front-end data model.
    fs.writeFile(frontend_data_model_output_path + item.object_name + ".ts", item.frontend_data_model, (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });

    // write shared data model.
    fs.writeFile(shared_data_model_output_path + item.object_name + ".ts", item.shared_data_model, (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });
  });

  // Write Object Registration file to .ts file.
  fs.writeFile(object_registration_output_path + "/Object_Registration.ts", state.object_registration_contents, (err: any) => {
    if (err) {
      console.error(err);
      res.sendStatus(500); // return fail error code 500 to client.
    }
  });

  // Write our notes contents to a .ts file.
  fs.writeFile(notes_output_path + "/notes.ts", JSON.stringify(state.notes), (err: any) => {
    if (err) {
      console.error(err);
      res.sendStatus(500); // return fail error code 500 to client.
    }
  });

  // * Move all files to their relevant locations within the frontend and backend folders one-level down from project root.

  let frontend_loc = root_project_path + "\\frontend";
  let frontend_src = root_project_path + "\\frontend\\src";
  let frontend_generated = root_project_path + "\\frontend\\src\\z_generated";
  let frontend_data_models = root_project_path + "\\frontend\\src\\z_generated\\Data_Models";
  let frontend_shared = root_project_path + "\\frontend\\src\\z_generated\\Data_Models\\shared";

  let backend_loc = root_project_path + "\\backend";
  let backend_src = root_project_path + "\\backend\\src";
  let backend_generated = root_project_path + "\\backend\\src\\z_generated";
  let backend_data_models = root_project_path + "\\backend\\src\\z_generated\\Data_Models";
  let backend_shared = root_project_path + "\\backend\\src\\z_generated\\Data_Models\\shared";

  // Clear generated folders.
  fs.rmSync(root_project_path + "\\frontend\\src\\z_generated", { recursive: true, force: true });
  fs.rmSync(root_project_path + "\\backend\\src\\z_generated", { recursive: true, force: true });

  // Put files (item.backend_data_model) in backend_data_model_output_path into the root_project_path/backend/src/Data_Models folder.
  state.object_file_data.forEach((item) => {
    fs.copyFile(backend_data_model_output_path + item.object_name + ".ts", backend_data_models + item.object_name + ".ts", (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });
  });

  // Put front-end files in their proper location too:
  state.object_file_data.forEach((item) => {
    fs.copyFile(frontend_data_model_output_path + item.object_name + ".ts", frontend_data_models + item.object_name + ".ts", (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });
  });

  // Put shared files into the two shared folders.
  state.object_file_data.forEach((item) => {
    fs.copyFile(shared_data_model_output_path + item.object_name + ".ts", frontend_shared + item.object_name + ".ts", (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });
  });
  state.object_file_data.forEach((item) => {
    fs.copyFile(shared_data_model_output_path + item.object_name + ".ts", backend_shared + item.object_name + ".ts", (err: any) => {
      if (err) {
        console.error(err);
        res.sendStatus(500); // return fail error code 500 to client.
      }
    });
  });

  // Write Object Registration file to .ts file on backend at [ root_project_path + "\\backend\\src\\ObjectRegistration.ts" ].
  fs.copyFile(object_registration_output_path + "/Object_Registration.ts", root_project_path + "\\backend\\src\\Object_Registration.ts", (err: any) => {
    if (err) {
      console.error(err);
      res.sendStatus(500); // return fail error code 500 to client.
    }
  });

  // Write the folders in the 'output_static_shared' folder to the frontend and backend to the shared paths.
  fs.copySync(output_static_shared_path, root_project_path + "\\frontend\\src\\z_generated\\Data_Models\\shared");
  fs.copySync(output_static_shared_path, root_project_path + "\\backend\\src\\z_generated\\Data_Models\\shared");

  // All files written successfully, send success return code to client with 200.
  res.sendStatus(200);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is loading existing class objects from files.`);

  // Load Note Data from files in notes_output_path.
  fs.readdir(notes_output_path, (err: any, files: any[]) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((file) => {
        fs.readFile(notes_output_path + file, "UTF-8", (err: any, data: any) => {
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
