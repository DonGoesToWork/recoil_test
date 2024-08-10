// index.ts (back-end)

import {
  Message_Action_Send,
  Payload_Add,
  Payload_Remove,
  Payload_Set,
} from "./CommunicationInterfaces";

import BackendState from "./storage";
import { Bee } from "./DataModels/Bee";
import { BeeFarm } from "./DataModels/BeeFarm";
import { BeeHive } from "./DataModels/BeeHive";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";

const app = express();
const PORT = 5000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

const storage = new BackendState();

const do_action = (action: string, args: any[]) => {
  if (action === "add_bee") {
    const newBee: Bee = {
      id: `bee-${Date.now()}`,
      name: `Abc`,
      hiveId: args[0],
    };

    const payload: Payload_Add = {
      objectType: "Bee",
      object: newBee,
    };

    storage.add(payload);
  } else if (action === "add_bee_hive") {
    const newHive: BeeHive = {
      id: `hive-${Date.now()}`,
      name: `Default Hive`,
      beeIds: [],
      farmId: args[0],
    };

    const payload: Payload_Add = {
      objectType: "BeeHive",
      object: newHive,
    };

    storage.add(payload);
  } else if (action === "add_bee_farm") {
    const newFarm: BeeFarm = {
      id: `farm-${Date.now()}`,
      name: `Default Farm`,
      hiveIds: [],
    };

    const payload: Payload_Add = {
      objectType: "BeeFarm",
      object: newFarm,
    };

    storage.add(payload);
  } else if (action === "set_bee_name") {
    const payload: Payload_Set = {
      objectType: "Bee",
      objectId: args[0],
      propertyName: "name",
      propertyValue: args[1],
    };

    storage.set(payload);
  } else if (action === "remove_bee") {
    const payload: Payload_Remove = {
      objectType: "Bee",
      objectId: args[0],
    };

    storage.remove(payload);
  }
};

wss.on("connection", (client: any) => {
  console.log("Client connected");

  client.on("message", (message: string) => {
    const message_action: Message_Action_Send = JSON.parse(message);
    do_action(message_action.function, message_action.args);

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(storage.change_payloads));
    });

    storage.clearChanges();
  });

  client.send(JSON.stringify(storage.get_full_storage()));
  storage.clearChanges();
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
