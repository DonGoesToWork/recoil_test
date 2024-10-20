import { Bee_Farm, IA_bee_add_farm, IO_Bee_Farm } from "../shared/Data_Models/Bee_Farm";
import { Payload_Add, Pre_Message_Action_Send } from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";

let add_bee_farm = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_bee_add_farm;

  const newFarm: IO_Bee_Farm = {
    id: `bee-farm-${Date.now()}`,
    name: `Default Farm`,
    hive_ids: [],
    parent_id: data.parent_id,
  };

  const payload: Payload_Add = {
    objectType: Bee_Farm.class_name,
    object: newFarm,
  };

  state.add(payload);
};

// Register all back-end checks

export let BC_Bee_Farm = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  switch (message_action.function_name) {
    case Bee_Farm.functions.add:
      add_bee_farm(message_action, state);
      return;
  }
};
