import { Bee_Farm, IO_Bee_Farm } from "../shared/Data_Models/Bee_Farm";
import {
  Payload_Add,
  Pre_Message_Action_Send,
} from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";

let add_bee_farm = (state: Backend_State): void => {
  const newFarm: IO_Bee_Farm = {
    id: `farm-${Date.now()}`,
    name: `Default Farm`,
    hive_ids: [],
  };

  const payload: Payload_Add = {
    objectType: Bee_Farm.class_name,
    object: newFarm,
  };

  state.add(payload);
};

// * Register all back-end checks.
export let BC_Bee_Farm = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  switch (message_action.function_name) {
    case Bee_Farm.functions.add:
      add_bee_farm(state);
      return;
  }
};
