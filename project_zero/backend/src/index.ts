// src/server.ts

import { create_folders, load_schemas } from "./utils/fileUtils";

import app from "./app";
import { createServer } from "http";

const PORT = 5002;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Server is loading existing class objects from files.");

  // Must create folders first.
  create_folders();

  // Load Schema Data from files in schemas_output_path.
  load_schemas();

  console.log("Successfully completed loading class objects from files.");
});
