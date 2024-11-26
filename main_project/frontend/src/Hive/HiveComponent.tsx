import { MO_Bee, SO_Bee } from "../z_generated/Shared_Data_Models/Bee";
import { MO_Bee_Farm, SO_Bee_Farm } from "../z_generated/Shared_Data_Models/Bee_Farm";
import { MO_Bee_Hive, SO_Bee_Hive } from "../z_generated/Shared_Data_Models/Bee_Hive";
import { MO_Farmer, SO_Farmer } from "../z_generated/Shared_Data_Models/Farmer";
import { MO_Nature, SO_Nature } from "../z_generated/Shared_Data_Models/Nature";
import { Message_Action_Send, Message_Recieve, Payload_Add, Payload_Delete, Payload_Set, Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";
import { create_new_bee_farm_w_parents, remove_bee_farm } from "../z_generated/Data_Models/Bee_Farm";
import { create_new_bee_hive_w_parents, remove_bee_hive } from "../z_generated/Data_Models/Bee_Hive";
import { create_new_bee_w_parents, remove_bee, set_bee_name } from "../z_generated/Data_Models/Bee";
import { create_new_farmer_wo_parent, remove_farmer } from "../z_generated/Data_Models/Farmer";
import { create_new_nature_wo_parent, remove_nature } from "../z_generated/Data_Models/Nature";
import { useEffect, useState } from "react";

import { I_Message_Sender } from "../utils/I_Message_Sender";
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
  message_array: Message_Recieve[];
  error_message?: string;
}

const HiveComponent: React.FC = () => {
  const [state, setState] = useState<Record<string, any>>({});
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  // let server_state_ref = "0"; // TODO - Implement

  useEffect(() => {
    const client = new WebSocketClient(`ws://localhost:5000?token=${encodeURIComponent("donald")}&token=${encodeURIComponent("robinson")}`, handleMessage, setConnected, setState);
    setWsClient(client);
    return () => client.close();
  }, []);

  const handleMessage = (message: string) => {
    if (message === "[]") {
      console.log("No message. Returning.");
      return;
    }

    const parsed_message_array: Client_Return_object = JSON.parse(message);
    console.log(parsed_message_array.server_state_ref, parsed_message_array);

    // Show errors and return when they occur.
    if (parsed_message_array.message_type === Message_Type.ERROR) {
      if (parsed_message_array.error_message !== undefined) {
        return;
      }
    } else if (parsed_message_array.message_type === Message_Type.FULL_STORAGE) {
      console.log("Clear");
      setState({});
    }

    setState((prev_state) => {
      const new_state = { ...prev_state };

      parsed_message_array.message_array.forEach((parsed_message: Message_Recieve) => {
        const messageType: string = parsed_message.messageType;

        if (messageType === "set") {
          const payload_set = parsed_message.payload as Payload_Set;

          const existing = new_state[payload_set.object_type][payload_set.id];

          if (existing) {
            existing[payload_set.property_name] = payload_set.property_value;
          }
        } else if (messageType === "add") {
          const payload_add = parsed_message.payload as Payload_Add;

          if (!new_state[payload_add.object_type]) {
            new_state[payload_add.object_type] = {};
          }

          new_state[payload_add.object_type][payload_add.object_id] = payload_add.object;
        } else if (messageType === "delete") {
          const payload_remove = parsed_message.payload as Payload_Delete;
          new_state[payload_remove.object_type] = Object.fromEntries(Object.entries(new_state[payload_remove.object_type]).filter(([key]) => key !== payload_remove.objectId));
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

  let nature_display = "";

  if (state[MO_Nature.class_name]) {
    nature_display = (Object.entries(state[MO_Nature.class_name]) as any | undefined).map((nature: SO_Nature) => (
      <div key={nature.id}>
        <h2>{nature.name}</h2>
        <h3>{nature.id}</h3>
        <button onClick={() => remove_nature(__SM__, nature.id)}>Remove Nature</button>💩
        <button onClick={() => create_new_bee_farm_w_parents(__SM__, "1", nature.id)}>Add Bee Farm</button>
      </div>
    ));
  }

  return (
    <div>
      <h1>Let's Grow!</h1>

      <hr />

      <button onClick={() => create_new_nature_wo_parent(__SM__)}>Add Nature</button>
      {nature_display}
      <hr />

      <button onClick={() => create_new_farmer_wo_parent(__SM__)}>Add Farmer</button>
      {state[MO_Farmer.class_name]?.map((farmer: SO_Farmer) => (
        <div key={farmer.id}>
          <h2>{farmer.name}</h2>
          <h3>{farmer.id}</h3>
          <button onClick={() => remove_farmer(__SM__, farmer.id)}>Remove Farmer</button>💩
          <button onClick={() => create_new_bee_farm_w_parents(__SM__, farmer.id, "1")}>Add Bee Farm</button>
          {state[MO_Bee_Farm.class_name]
            ?.filter((farm: SO_Bee_Farm) => farm.parent_data.farmer_id === farmer.id)
            .map((farm: SO_Bee_Farm) => (
              <div key={farm.id}>
                <h2>{farm.name}</h2>
                <h3>{farm.id}</h3>
                <button onClick={() => remove_bee_farm(__SM__, farm.id)}>Remove Farm</button>💩
                <button onClick={() => create_new_bee_hive_w_parents(__SM__, farm.id)}>Add Hive</button>
                {state[MO_Bee_Hive.class_name]
                  ?.filter((hive: SO_Bee_Hive) => hive.parent_data.bee_farm_id === farm.id)
                  .map((hive: SO_Bee_Hive) => (
                    <div key={hive.id}>
                      <h3>{hive.name}</h3>
                      <h3>{hive.id}</h3>
                      <button onClick={() => remove_bee_hive(__SM__, hive.id)}>Remove Hive</button>💩
                      <button onClick={() => create_new_bee_w_parents(__SM__, hive.id)}>Add Bee</button>
                      {state[MO_Bee.class_name]
                        ?.filter((bee: SO_Bee) => bee.parent_data.bee_hive_id === hive.id)
                        .map((bee: SO_Bee) => (
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
