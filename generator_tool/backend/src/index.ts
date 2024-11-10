// src/server.ts

import app from "./app";
import { createServer } from "http";
import { loadNotes } from "./utils/fileUtils";

const PORT = 5002;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Server is loading existing class objects from files.");

  // Load Note Data from files in notes_output_path.
  loadNotes();

  console.log("Successfully completed loading class objects from files.");
});
