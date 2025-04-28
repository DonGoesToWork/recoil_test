import {
  Message_Action_Send,
  Message_Receive,
  Payload_Add,
  Payload_Delete,
  Payload_Set,
  Pre_Message_Action_Send,
} from "../z_generated/Shared_Misc/Communication_Interfaces";
import { create_new_bee_farm_w_parents, remove_bee_farm } from "../z_generated/Frontend_Data_Models/Bee_Farm";
import { create_new_bee_hive_w_parents, remove_bee_hive } from "../z_generated/Frontend_Data_Models/Bee_Hive";
import { create_new_bee_w_parents, remove_bee, set_bee_name } from "../z_generated/Frontend_Data_Models/Bee";
import { create_new_farmer_wo_parent, remove_farmer } from "../z_generated/Frontend_Data_Models/Farmer";
import { create_new_nature_wo_parent, remove_nature } from "../z_generated/Frontend_Data_Models/Nature";
import { useEffect, useState } from "react";

import App_State from "../z_generated/App_State/App_State";
import { I_Message_Sender } from "../utils/I_Message_Sender";
import { SO_Bee } from "../z_generated/Shared_Data_Models/Bee_Interfaces";
import { SO_Bee_Farm } from "../z_generated/Shared_Data_Models/Bee_Farm_Interfaces";
import { SO_Bee_Hive } from "../z_generated/Shared_Data_Models/Bee_Hive_Interfaces";
import { SO_Farmer } from "../z_generated/Shared_Data_Models/Farmer_Interfaces";
import { SO_Nature } from "../z_generated/Shared_Data_Models/Nature_Interfaces";
import WebSocketClient from "../ws/ws";
import generate_unique_id from "../utils/utils";

enum Message_Type {
  FULL_STORAGE = "full_storage",
  CHANGE_PAYLOADS = "change_payloads",
  ERROR = "error",
}

interface Client_Return_object {
  message_type: Message_Type;
  server_state_ref: string;
  message_array: Message_Receive[];
  error_message?: string;
}

const HiveComponent: React.FC = () => {
  const [state, setState] = useState<App_State>(new App_State());
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [unique_client_id, set_unique_client_id] = useState<string>(generate_unique_id());

  // let server_state_ref = "0"; // TODO - Implement

  useEffect(() => {
    const client = new WebSocketClient(
      `ws://localhost:5000?token=${encodeURIComponent("donald")}&token=${encodeURIComponent("robinson")}&token=${unique_client_id}`,
      handleMessage,
      setConnected,
      setState
    );
    setWsClient(client);
    return () => client.close();
  }, []);

  const handleMessage = (message: string) => {
    if (message === "[]") {
      console.log("No message. Returning.");
      return;
    }

    const parsed_message_array: Client_Return_object = JSON.parse(message);
    // console.log("RECIEVED MSG: ", parsed_message_array.server_state_ref, parsed_message_array);

    // Show errors and return when they occur.
    if (parsed_message_array.message_type === Message_Type.ERROR) {
      if (parsed_message_array.error_message !== undefined) {
        return;
      }
    } else if (parsed_message_array.message_type === Message_Type.FULL_STORAGE) {
      console.log("Clear");
      setState(new App_State());
    }

    setState((prev_state) => {
      const new_state: any = { ...prev_state }; // TODO: Find some way to not have to use 'any'.

      parsed_message_array.message_array.forEach((parsed_message: Message_Receive) => {
        const messageType: string = parsed_message.messageType;

        if (messageType === "set") {
          const payload_set = parsed_message.payload as Payload_Set;

          const existing: any = new_state[payload_set.object_type][payload_set.id];

          if (existing) {
            existing[payload_set.property_l1_name] = payload_set.property_value;
          }
        } else if (messageType === "add") {
          const payload_add = parsed_message.payload as Payload_Add;

          if (!new_state[payload_add.object_type]) {
            new_state[payload_add.object_type] = {};
          }

          new_state[payload_add.object_type][payload_add.object_id] = payload_add.object;
        } else if (messageType === "delete") {
          const payload_remove = parsed_message.payload as Payload_Delete;
          new_state[payload_remove.object_type] = Object.fromEntries(
            Object.entries(new_state[payload_remove.object_type]).filter(([key]) => key !== payload_remove.objectId)
          );
        }
      });

      new_state["server_state_ref"] = parsed_message_array.server_state_ref;
      return new_state;
    });
  };

  const __SM__: I_Message_Sender = (update: Pre_Message_Action_Send): void => {
    let final_update: Message_Action_Send = update as Message_Action_Send;
    final_update["server_state_ref"] = state.server_state_ref; // Add server state ref.
    final_update["request_id"] = generate_unique_id();
    wsClient?.sendMessage(JSON.stringify(update)); // Send update
  };

  // Show loading until we are connected with ws.
  if (!connected) {
    if (wsClient === null) {
      return <div>Loading...</div>;
    }

    // Show loading for all other cases.
    return (
      <div>
        <p>Connection broken.</p>
        <p>Attempting reconnect every second until reconnected.</p>
      </div>
    );
  }

  function get_nature_entires(): [string, SO_Nature][] {
    if (state.nature === undefined) {
      return [];
    }

    let nature_entries = Object.entries(state.nature) as [string, SO_Nature][];
    return nature_entries;
  }
  function get_bee_farm_for_nature_entries(nature_id: string): [string, SO_Bee_Farm][] {
    if (state.bee_farm === undefined) {
      return [];
    }

    let bee_farm_entries = Object.entries(state.bee_farm) as [string, SO_Bee_Farm][];
    bee_farm_entries = bee_farm_entries.filter(([bee_farm_id, bee_farm]: [string, SO_Bee_Farm]) => bee_farm.parent_id_data.nature.indexOf(nature_id) != -1);
    return bee_farm_entries;
  }

  let nature_display;

  if (state.nature) {
    nature_display = get_nature_entires().map(([nature_id, nature]) => (
      <div key={nature.id}>
        <h2>{nature.name}</h2>
        <h3>{nature.id}</h3>
        <button onClick={() => remove_nature(__SM__, nature.id)}>Remove Nature</button>
        💩
        <button onClick={() => create_new_bee_farm_w_parents(__SM__, "-1", nature.id)}>Add Bee Farm</button>
        {get_bee_farm_for_nature_entries(nature_id).map(([bee_farm_id, bee_farm]: [string, SO_Bee_Farm]) => (
          <div key={bee_farm_id}>
            <h2>{bee_farm.name}</h2>
            <h3>{bee_farm_id}</h3>
            <button onClick={() => remove_bee_farm(__SM__, bee_farm_id)}>Remove Bee Farm</button>
            💩
          </div>
        ))}
      </div>
    ));
  }

  // Show state debug.
  console.log("STATE: ", state);

  return (
    <div>
      <h1>Let's Grow!</h1>

      <hr />

      <button onClick={() => create_new_nature_wo_parent(__SM__)}>Add Nature</button>
      {nature_display}
      <hr />

      <button onClick={() => create_new_farmer_wo_parent(__SM__)}>Add Farmer</button>
      {Object.values(state.farmer.get_data()).map((farmer: SO_Farmer) => (
        <div key={farmer.id}>
          <h2>{farmer.name}</h2>
          <h3>{farmer.id}</h3>
          <button onClick={() => remove_farmer(__SM__, farmer.id)}>Remove Farmer</button>
          💩
          <button onClick={() => create_new_bee_farm_w_parents(__SM__, farmer.id, "-1")}>Add Bee Farm</button>
          {state.farmer.get_child_bee_farm(state, farmer.id).map((farm: SO_Bee_Farm) => (
            <div key={farm.id}>
              <h2>{farm.name}</h2>
              <h3>{farm.id}</h3>
              <button onClick={() => remove_bee_farm(__SM__, farm.id)}>Remove Farm</button>
              💩
              <button onClick={() => create_new_bee_hive_w_parents(__SM__, farm.id)}>Add Hive</button>
              {state.bee_farm.get_child_bee_hive(state, farm.id).map((hive: SO_Bee_Hive) => (
                <div key={hive.id}>
                  <h3>{hive.name}</h3>
                  <h3>{hive.id}</h3>
                  <button onClick={() => remove_bee_hive(__SM__, hive.id)}>Remove Hive</button>
                  💩
                  <button onClick={() => create_new_bee_w_parents(__SM__, hive.id)}>Add Bee</button>
                  {state.bee_hive.get_child_bee(state, hive.id).map((bee: SO_Bee) => (
                    <div key={bee.id}>
                      <p>{bee.name}</p>
                      <p>{bee.id}</p>
                      <input
                        type="text"
                        value={bee.name}
                        onChange={(e) => {
                          set_bee_name(__SM__, bee.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => {
                          remove_bee(__SM__, bee.id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default HiveComponent;
