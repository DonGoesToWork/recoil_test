import { Bee_Farm, FN_bee_add_farm } from "../shared/Data_Models/Bee_Farm";
import {
  Payload_Add,
  Pre_Message_Action_Send,
} from "../shared/Communication/Communication_Interfaces";

import Backend_State from "./Backend_State/Backend_State";

let add_bee_farm = (state: Backend_State): void => {
  const newFarm: Bee_Farm = {
    id: `farm-${Date.now()}`,
    name: `Default Farm`,
    hive_ids: [],
  };

  const payload: Payload_Add = {
    objectType: "Bee_Farm",
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
    case FN_bee_add_farm:
      add_bee_farm(state);
      return;
  }
};
