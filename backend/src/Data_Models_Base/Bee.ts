import { Bee, IA_bee_add, IA_bee_set_name, IO_Bee } from "../shared/Data_Models/Bee";
import { Payload_Add, Payload_Set, Pre_Message_Action_Send } from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";

let add_bee = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_bee_add;

  const newBee: IO_Bee = {
    id: `bee-${Date.now()}`,
    name: `Abc`,
    parent_id: data.parent_id,
  };

  const payload: Payload_Add = {
    objectType: Bee.class_name,
    object: newBee,
  };

  state.add(payload);
};

let set_bee_name = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data: IA_bee_set_name = message_action as IA_bee_set_name;

  const payload: Payload_Set = {
    objectType: Bee.class_name,
    id: data.bee_id,
    propertyName: Bee.properties.name,
    propertyValue: data.new_name,
  };

  state.set(payload);
};

// Register all back-end checks.

export let BC_Bee = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  switch (message_action.function_name) {
    case Bee.functions.add:
      add_bee(message_action, state);
      return;
    case Bee.functions.set_name:
      set_bee_name(message_action, state);
      return;
  }
};
