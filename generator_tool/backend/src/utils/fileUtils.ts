// src/utils/fileUtils.ts

import fs from "node:fs";
import { output_paths } from "../config";
import { state } from "../types";

export const ensure_exists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const create_folders = () => {
  Object.values(output_paths).forEach(ensure_exists);
};

export const write_file = (res: any, filePath: string, contents: string) => {
  fs.writeFile(filePath, contents, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
};

export const load_notes = () => {
  console.log("Loading notes from: ", output_paths.notes);

  fs.readdir(output_paths.notes, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((file) => {
        fs.readFile(output_paths.notes + file, "utf-8", (er: any, data: any) => {
          if (err) {
            console.error(err);
          } else {
            state.notes.push(JSON.parse(data));
          }
        });
      });
    }
  });
};

export const copy_folder_to_folder = (src: string, dest: string) => {
  fs.readdir(src, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((file) => {
        fs.copyFile(src + file, dest + file, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    }
  });
};
