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

  client.send(JSON.stringify(storage.getFullStorage())); // DOES NOT WORK. HOW TO IMPLEMENT BETTER?

  client.on("message", (message: string) => {
    const parsedMessageArr: any[] = JSON.parse(message);

    for (let i = 0; i < parsedMessageArr.length; i++) {
      let parsedMessage = parsedMessageArr[i];

      // Handle different types of messages
      if (parsedMessage.messageType === "set") {
        storage.set(
          parsedMessage.objectType,
          parsedMessage.id,
          parsedMessage.changes
        );
      } else if (parsedMessage.messageType === "add") {
        storage.add(parsedMessage.objectType, parsedMessage.object);
      } else if (parsedMessage.messageType === "remove") {
        storage.remove(parsedMessage.objectType, parsedMessage.id);
      }
    }

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(parsedMessageArr));
    });
  });

  // Initially send the full storage when a client connects
  client.send(JSON.stringify(storage.getFullStorage()));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
