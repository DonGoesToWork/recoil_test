import {
  Bee,
  CN_Bee,
  FN_bee_add,
  FN_bee_remove,
  FN_bee_set_name,
  IA_bee_add,
  IA_bee_remove,
  IA_bee_set_name,
} from "../shared/Data_Models/Bee";
import {
  Payload_Add,
  Payload_Remove,
  Payload_Set,
  Pre_Message_Action_Send,
} from "../shared/Communication/Communication_Interfaces";

import Backend_State from "./Backend_State/Backend_State";

let add_bee = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  let data = message_action as IA_bee_add;

  const newBee: Bee = {
    id: `bee-${Date.now()}`,
    name: `Abc`,
    hive_id: data.hive_id,
  };

  const payload: Payload_Add = {
    objectType: CN_Bee,
    object: newBee,
  };

  state.add(payload);
};

let remove_bee = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  let data = message_action as IA_bee_remove;

  const payload: Payload_Remove = {
    objectType: CN_Bee,
    objectId: data.bee_id,
  };

  state.remove(payload);
};

let set_bee_name = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  let data: IA_bee_set_name = message_action as IA_bee_set_name;

  const payload: Payload_Set = {
    objectType: CN_Bee,
    id: data.bee_id,
    propertyName: "name",
    propertyValue: data.new_name,
  };

  state.set(payload);
};

// * Register all back-end checks.
export let BC_Bee = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  switch (message_action.function_name) {
    case FN_bee_remove:
      remove_bee(message_action, state);
      return;
    case FN_bee_add:
      add_bee(message_action, state);
      return;
    case FN_bee_set_name:
      set_bee_name(message_action, state);
      return;
  }
};
