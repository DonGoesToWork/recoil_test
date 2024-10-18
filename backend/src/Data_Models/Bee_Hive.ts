import {
  Bee_Hive,
  FN_bee_add_hive,
  IA_bee_add_hive,
} from "../shared/Data_Models/Bee_Hive";
import {
  Payload_Add,
  Pre_Message_Action_Send,
} from "../shared/Communication/Communication_Interfaces";

import Backend_State from "./Backend_State/Backend_State";

let add_bee_hive = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  let data = message_action as IA_bee_add_hive;

  const newHive: Bee_Hive = {
    id: `hive-${Date.now()}`,
    name: `Default Hive`,
    bee_ids: [],
    farm_id: data.farm_id,
  };

  const payload: Payload_Add = {
    objectType: "Bee_Hive",
    object: newHive,
  };

  state.add(payload);
};

// * Register all back-end checks.
export let BC_Bee_Hive = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  switch (message_action.function_name) {
    case FN_bee_add_hive:
      add_bee_hive(message_action, state);
      return;
  }
};
