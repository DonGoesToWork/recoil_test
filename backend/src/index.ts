// index.ts (back-end)

import { Class_Function, Object_Class_Function_Map, Register_Objects } from "./Objerct_Registration";

import Backend_State from "./static_internal_logic/Backend_State";
import { DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME } from "./shared/Data_Models/Generic_Remove";
import { Message_Action_Send } from "./shared/Communication/Communication_Interfaces";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { delete_full } from "./Data_Models_Base/Generic_Remove";
import express from "express";

const app = express();
const PORT = 5000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Create our main state object.
const state = new Backend_State();

// Initialize references to all object class functions.
let object_class_function_map: Object_Class_Function_Map = {};
Register_Objects(object_class_function_map);

let random_server_state_ref = "0";

wss.on("connection", (client: any) => {
  console.log("Client connected");

  client.on("message", (message: string) => {
    const message_action: Message_Action_Send = JSON.parse(message);

    // console.log("Message received: ", message_action, object_class_function_map);

    // For 'delete function' calls, route all of them to the removal function.
    if (message_action.function_name === DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME) {
      delete_full(message_action, state);
    }

    // * Get and call class function after ensuring that it exists.
    let class_function: Class_Function = object_class_function_map[message_action.object_class];

    if (class_function === undefined || class_function === null) {
      console.log("[Error] Bad Object Transmitted. Make sure object is registered in ObjectRegistration.ts and you added back-end checks switch-cases!: ", message_action.object_class);
      return;
    }

    // Randomize server state. (Must always randomize before making changes)
    random_server_state_ref = "1"; // TODO -> Randomize

    // Call class function
    class_function(message_action, state);

    // Send changes to all other clients.
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(state.change_payloads));
    });

    state.clearChanges(); // Always clear changes post-transmission.
  });

  // Send full storage to newly connected clients.
  client.send(JSON.stringify(state.get_full_storage()));
  state.clearChanges(); // Always clear changes post-transmission.
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
