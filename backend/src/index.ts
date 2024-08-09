// index.ts (back-end)

import {
  Message,
  Message_Arr,
  Payload_Add,
  Payload_Remove,
  Payload_Set,
} from "./CommunicationInterfaces";

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
    const parsedMessageArr: Message_Arr = JSON.parse(message);

    parsedMessageArr.messageArr.forEach((parsedMessage: Message) => {
      const messageType = parsedMessage.messageType;

      if (messageType === "set") {
        storage.set(parsedMessage.payload as Payload_Set);
      } else if (messageType === "add") {
        storage.add(parsedMessage.payload as Payload_Add);
      } else if (messageType === "remove") {
        storage.remove(parsedMessage.payload as Payload_Remove);
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
