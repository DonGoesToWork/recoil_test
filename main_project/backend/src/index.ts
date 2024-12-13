// index.ts (back-end)

import { Class_Function, Object_Class_Function_Map, Register_Objects } from "./z_generated/Data_Registration/Object_Registration";
import { Message_Action_Send, Message_Recieve } from "./z_generated/Shared_Misc/Communication_Interfaces";

import Backend_State from "./static_internal_logic/Backend_State";
import { DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME } from "./utils/IA_Remove";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { delete_object_and_relations } from "./static_internal_logic/Generic_Remove";
import express from "express";
import { parse } from "url";

const app = express();
const PORT = 5000;

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Create our main state object.
const state = new Backend_State();

// Initialize references to all object class functions.
let object_class_function_map: Object_Class_Function_Map = {};
Register_Objects(object_class_function_map);

enum Message_Type {
  FULL_STORAGE = "full_storage",
  CHANGE_PAYLOADS = "change_payloads",
  ERROR = "error",
}

interface Client_Return_object {
  message_type: Message_Type;
  server_state_ref: string;
  message_array: Message_Recieve[];
  error_message?: string;
}

type Client_Object = {
  username: string;
  password: string;
  security_level: string;
  connected: {
    [client_id: string]: boolean;
  };
  last_request_id: string;
};

type Client_Objects = [Client_Object];

const clients: Client_Objects = [
  {
    username: "donald",
    password: "robinson",
    security_level: "root",
    connected: {},
    last_request_id: "",
  },
];

// Function to get user_object from client map.
function get_user_object(ws: any, username: string, password: string, client_id: string): Client_Object | null {
  let user_object: Client_Object | undefined = clients.find((client) => client.username === username && client.password === password);

  if (!user_object) {
    ws.close(1008, "Authentication failed");
    console.log("Authentication failed");
    return null;
  }

  if (user_object.connected[client_id] === undefined) {
    user_object.connected[client_id] = true;
  } else if (user_object.connected[client_id]) {
    ws.close(1008, "Client already connected.");
    console.log("Client already connected.");
    return null;
  }

  return user_object;
}

wss.on("connection", (ws: any, req: any) => {
  // Evaluate request
  const query = parse(req.url, true).query;
  const token = query.token;

  if (!token) {
    ws.close(1008, "Token missing");
    console.log("Token missing");
    return null;
  }

  if (token[1] === undefined || token[1] === "") {
    ws.close(1008, "Token 2 missing.");
    console.log("Token 2 missing.");
    return null;
  }

  if (token[2] === undefined || token[2] === "") {
    ws.close(1008, "Token 3 missing.");
    console.log("Token 3 missing.");
    return null;
  }

  let [username, password, client_id] = token;

  // Authenticate.
  let user_object: Client_Object | null = get_user_object(ws, username, password, client_id);

  if (!user_object) {
    return;
  }

  // Officially connect user.
  console.log(`Client connected: ${token}`);

  ws.on("close", () => {
    user_object.connected[client_id] = false;
    console.log(`Client disconnected: ${token}`);
  });

  ws.on("message", (message: any) => {
    console.log(`- Message from ${token}: ${message}`);
  });

  ws.on("message", (message: string) => {
    const message_action: Message_Action_Send = JSON.parse(message);

    // Check request id first.
    if (message_action.request_id === user_object.last_request_id) {
      console.log("[Error] Duplicate request id received. Ignoring request.");
      return;
    }

    // Check server state ref second.
    console.log(message_action.server_state_ref, " ", state.server_state_ref, " ", message_action.request_id);

    if (message_action.server_state_ref !== state.server_state_ref) {
      console.log("[Error] Out of sync client request rejected. Expected: ", state.server_state_ref, " Received: ", message_action.server_state_ref);
      ws.send(
        JSON.stringify({
          message_type: Message_Type.ERROR,
          server_state_ref: "",
          message_array: [],
        })
      );
      return;
    }

    // For 'delete function' calls, route all of them to the removal function.
    if (message_action.function_name === DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME) {
      delete_object_and_relations(message_action, state);
    } else {
      let class_function_list: { [key: string]: Class_Function } = object_class_function_map[message_action.object_class];

      if (class_function_list === undefined || class_function_list === null) {
        console.log("[Error 1] Bad Object Transmitted. Object Class is Invalid: ", message_action.object_class);
        console.log("If this object type was recently created and exported from Project Zero, then you must restart this backend. Live refresh won't work.");
        return;
      }

      let class_function: Class_Function = class_function_list[message_action.function_name];

      if (class_function === undefined || class_function === null) {
        console.log("[Error 2] Bad Object Transmitted. Function name is invalid.", message_action.function_name, " Object Class: ", message_action.object_class);
        return;
      }

      // Call class function
      class_function(message_action, state);
    }

    // Send changes to all other clients.
    state.randomize_server_state_ref(); // always randomize state before sending changes to clients
    user_object.last_request_id = message_action.request_id; // update the last request id too
    let client_return_object: Client_Return_object = {
      message_type: Message_Type.CHANGE_PAYLOADS,
      server_state_ref: state.server_state_ref,
      message_array: state.change_payloads,
    };

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(client_return_object));
      console.log("Sending");
    });

    state.clearChanges(); // Always clear changes post-transmission.
  });

  // Send full storage to newly connected clients.
  state.randomize_server_state_ref(); // always randomize state before sending changes to clients
  let client_return_object: Client_Return_object = {
    message_type: Message_Type.FULL_STORAGE,
    server_state_ref: state.server_state_ref,
    message_array: state.get_full_storage(),
  };
  ws.send(JSON.stringify(client_return_object));
  state.clearChanges(); // Always clear changes post-transmission.
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
