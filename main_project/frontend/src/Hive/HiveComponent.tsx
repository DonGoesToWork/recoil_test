import { Bee, IO_Bee } from "../z_generated/Shared_Data_Models/Bee";
import { Bee_Farm, IO_Bee_Farm } from "../z_generated/Shared_Data_Models/Bee_Farm";
import { Bee_Hive, IO_Bee_Hive } from "../z_generated/Shared_Data_Models/Bee_Hive";
import { Farmer, IO_Farmer } from "../z_generated/Shared_Data_Models/Farmer";
import { Message_Action_Send, Message_Arr_Recieve, Message_Recieve, Payload_Add, Payload_Delete, Payload_Set, Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";
import { create_new_bee, remove_bee, set_bee_name } from "../z_generated/Data_Models/Bee";
import { create_new_bee_farm, remove_bee_farm } from "../z_generated/Data_Models/Bee_Farm";
import { create_new_bee_hive, remove_bee_hive } from "../z_generated/Data_Models/Bee_Hive";
import { create_new_farmer, remove_farmer } from "../z_generated/Data_Models/Farmer";
import { useEffect, useState } from "react";

import { I_Message_Sender } from "../utils/I_Message_Sender";
import WebSocketClient from "../ws/ws";

const HiveComponent: React.FC = () => {
  const [state, setState] = useState<Record<string, any[]>>({});
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  let server_state_ref = "0"; // TODO - Implement

  useEffect(() => {
    const client = new WebSocketClient("ws://localhost:5000", handleMessage, setConnected);
    setWsClient(client);
    return () => client.close();
  }, []);

  const handleMessage = (message: string) => {
    if (message === "[]") {
      console.log("No message. Returning.");
      return;
    }

    const parsedMessageArr: Message_Arr_Recieve = JSON.parse(message);

    setState((prevState) => {
      const newState = { ...prevState };

      parsedMessageArr.messageArr.forEach((parsedMessage: Message_Recieve) => {
        const messageType: string = parsedMessage.messageType;

        if (messageType === "set") {
          const payload_set = parsedMessage.payload as Payload_Set;

          const existing = newState[payload_set.objectType]?.find((item) => item.id === payload_set.id);

          if (existing) {
            existing[payload_set.propertyName] = payload_set.propertyValue;
          }
        } else if (messageType === "add") {
          const payload_add = parsedMessage.payload as Payload_Add;

          if (!newState[payload_add.objectType]) {
            newState[payload_add.objectType] = [];
          }

          // reject duplicates
          const isDuplicate = newState[payload_add.objectType].some((item) => item.id === payload_add.object.id);

          if (!isDuplicate) {
            newState[payload_add.objectType].push(payload_add.object);
          }
        } else if (messageType === "delete") {
          const payload_remove = parsedMessage.payload as Payload_Delete;

          newState[payload_remove.objectType] = newState[payload_remove.objectType].filter((item) => item.id !== payload_remove.objectId);
        }
      });
      return newState;
    });
  };

  const __SM__: I_Message_Sender = (update: Pre_Message_Action_Send): void => {
    let finalUpdate: Message_Action_Send = update as Message_Action_Send;
    finalUpdate["server_state_ref"] = server_state_ref; // Add server state ref.
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

  return (
    <div>
      <h1>Let's Grow!</h1>

      <button onClick={() => create_new_farmer(__SM__)}>Add Farmer</button>
      {state[Farmer.class_name]?.map((farmer: IO_Farmer) => (
        <div key={farmer.id}>
          <h2>{farmer.name}</h2>
          <h3>{farmer.id}</h3>
          <button onClick={() => remove_farmer(__SM__, farmer.id)}>Remove Farmer</button>💩
          <button onClick={() => create_new_bee_farm(__SM__, farmer.id)}>Add Bee Farm</button>
          {state[Bee_Farm.class_name]
            ?.filter((farm: IO_Bee_Farm) => farm.parent_id === farmer.id)
            .map((farm: IO_Bee_Farm) => (
              <div key={farm.id}>
                <h2>{farm.name}</h2>
                <h3>{farm.id}</h3>
                <button onClick={() => remove_bee_farm(__SM__, farm.id)}>Remove Farm</button>💩
                <button onClick={() => create_new_bee_hive(__SM__, farm.id)}>Add Hive</button>
                {state[Bee_Hive.class_name]
                  ?.filter((hive: IO_Bee_Hive) => hive.parent_id === farm.id)
                  .map((hive: IO_Bee_Hive) => (
                    <div key={hive.id}>
                      <h3>{hive.name}</h3>
                      <h3>{hive.id}</h3>
                      <button onClick={() => remove_bee_hive(__SM__, hive.id)}>Remove Hive</button>💩
                      <button onClick={() => create_new_bee(__SM__, hive.id)}>Add Bee</button>
                      {state[Bee.class_name]
                        ?.filter((bee: IO_Bee) => bee.parent_id === hive.id)
                        .map((bee: IO_Bee) => (
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
        </div>
      ))}
    </div>
  );
};

export default HiveComponent;
