// src/routes/export.ts

import { Client_Message, state } from "../types";
import { copyFolderToFolder, createFolders } from "../utils/fileUtils";
import fs, { writeFile } from "node:fs";
import { main_project_paths, output_paths } from "../config";

import express from "express";

const router = express.Router();

router.post("/", (req: any, res: any) => {
  console.log("Received export command.");

  // Update state
  Object.assign(state, req.body as Client_Message);

  // Clear and recreate folders
  if (fs.existsSync(output_paths.base)) {
    fs.rmSync(output_paths.base, { recursive: true, force: true });
  }
  createFolders();

  state.object_file_data.forEach((item: any) => {
    writeFile(res, `${output_paths.backend_data_model}${item.object_name}.ts`, item.backend_data_model);
    writeFile(res, `${output_paths.frontend_data_model}${item.object_name}.ts`, item.frontend_data_model);
    writeFile(res, `${output_paths.shared_data_model}${item.object_name}.ts`, item.shared_data_model);
  });

  copyFolderToFolder(output_paths.object_registration, main_project_paths.object_registration_file);
  res.sendStatus(200);
});

export default router;
