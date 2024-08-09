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
    const parsedMessageArr: any[] = JSON.parse(message);

    parsedMessageArr.forEach((parsedMessage) => {
      const { messageType, objectType, id, changes, object } = parsedMessage;

      if (messageType === "set") {
        storage.set(objectType, id, changes);
      } else if (messageType === "add") {
        storage.add(objectType, object);
      } else if (messageType === "remove") {
        storage.remove(objectType, id);
      }
    });

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(parsedMessageArr));
    });
  });

  client.send(JSON.stringify(storage.getFullStorage()));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
