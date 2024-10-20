import { Bee_Hive, IA_bee_hive_add, IO_Bee_Hive } from "../shared/Data_Models/Bee_Hive";
import { Payload_Add, Payload_Remove, Pre_Message_Action_Send } from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";

// import { IA_Object_Remove } from "../shared/Data_Models/Generic_Remove";

let add_bee_hive = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_bee_hive_add;

  const newHive: IO_Bee_Hive = {
    id: `hive-${Date.now()}`,
    name: `Default Hive`,
    bee_ids: [],
    parent_id: data.parent_id,
  };

  const payload: Payload_Add = {
    objectType: Bee_Hive.class_name,
    object: newHive,
  };

  state.add(payload);
};

// Register all back-end checks

export let BC_Bee_Hive = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  switch (message_action.function_name) {
    case Bee_Hive.functions.add:
      add_bee_hive(message_action, state);
      return;
  }
};
