import BackendState from "./storage";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";

const app = express();
const PORT = 5000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

const storage = new BackendState();

wss.on("connection", (client: any) => {
  console.log("Client connected");

  client.on("message", (message: string) => {
    const parsedMessage = JSON.parse(message);

    // Handle different types of messages
    if (parsedMessage.type === "set") {
      storage.set(
        parsedMessage.objectType,
        parsedMessage.id,
        parsedMessage.changes
      );
    } else if (parsedMessage.type === "add") {
      storage.add(parsedMessage.objectType, parsedMessage.object);
    } else if (parsedMessage.type === "remove") {
      storage.remove(parsedMessage.objectType, parsedMessage.id);
    }

    // Send only the changes to all clients
    const changedData = storage.getChangedObjects();
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(changedData));
    });

    // Clear the changes after sending
    storage.clearChanges();
  });

  // Initially send the full storage when a client connects
  client.send(JSON.stringify(storage.getFullStorage()));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
