// src/routes/export.ts

import { Client_Message, Object_File_Data, state } from "../types";
import { copy_folder_to_folder, create_folders, write_file } from "../utils/fileUtils";
import { main_project_paths, output_paths, root_project_path } from "../config";

import express from "express";
import fs from "node:fs";

const router = express.Router();

router.post("/", (req: any, res: any) => {
  console.log("Received export command.");

  // Update state
  Object.assign(state, req.body as Client_Message);

  // Clear and recreate folders
  if (fs.existsSync(output_paths.base)) {
    fs.rmSync(output_paths.base, { recursive: true, force: true });
  }

  create_folders();

  // Write all of the main objects to .ts files.

  state.object_file_data.forEach((item: Object_File_Data) => {
    write_file(res, output_paths.backend_data_model + item.object_name + ".ts", item.backend_data_model);
    write_file(res, output_paths.frontend_data_model + item.object_name + ".ts", item.frontend_data_model);
    write_file(res, output_paths.shared_object_state + item.object_name + "_State.ts", item.shared_object_state);
    write_file(res, output_paths.shared_data_model + item.object_name + "_Interfaces.ts", item.shared_data_model);
  });

  write_file(res, output_paths.data_registration + "/Global_Class_Map.ts", state.global_class_map_contents);
  write_file(res, output_paths.data_registration + "/Object_Registration.ts", state.object_registration_contents);

  write_file(res, output_paths.frontend_app_state + "/App_State.ts", state.frontend_app_state);
  write_file(res, output_paths.backend_app_state + "/App_State.ts", state.backend_app_state);

  write_file(res, output_paths.schemas + "/schemas.ts", JSON.stringify(state.schemas));

  // * Move all files to their relevant locations within the frontend and backend folders one-level down from project root.

  // Clear generated folders.
  fs.rmSync(root_project_path + "\\main_project\\frontend\\src\\z_generated", {
    recursive: true,
    force: true,
  });
  fs.rmSync(root_project_path + "\\main_project\\backend\\src\\z_generated", {
    recursive: true,
    force: true,
  });

  copy_folder_to_folder(output_paths.backend_data_model, main_project_paths.backend_data_models);
  copy_folder_to_folder(output_paths.frontend_data_model, main_project_paths.frontend_data_models);

  copy_folder_to_folder(output_paths.data_registration, main_project_paths.backend_data_registration);

  copy_folder_to_folder(output_paths.shared_data_model, main_project_paths.frontend_data_models_shared);
  copy_folder_to_folder(output_paths.shared_data_model, main_project_paths.backend_data_models_shared);

  copy_folder_to_folder(output_paths.output_static_shared, main_project_paths.frontend_shared);
  copy_folder_to_folder(output_paths.output_static_shared, main_project_paths.backend_shared);

  copy_folder_to_folder(output_paths.output_static_object_state_back, main_project_paths.backend_app_state);
  copy_folder_to_folder(output_paths.output_static_object_state_front, main_project_paths.frontend_app_state);

  copy_folder_to_folder(output_paths.shared_object_state, main_project_paths.frontend_shared_object_state);
  copy_folder_to_folder(output_paths.shared_object_state, main_project_paths.backend_shared_object_state);

  copy_folder_to_folder(output_paths.frontend_app_state, main_project_paths.frontend_app_state);
  copy_folder_to_folder(output_paths.backend_app_state, main_project_paths.backend_app_state);

  res.status(200).json({ status: "ok" });
});

export default router;
