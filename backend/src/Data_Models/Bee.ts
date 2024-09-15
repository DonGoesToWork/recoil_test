import {
  Bee,
  CN_Bee,
  FN_add_bee,
  FN_remove_bee,
  FN_set_bee_name,
  IA_add_bee,
  IA_remove_bee,
  IA_set_bee_name,
} from "../shared/Data_Models/Bee";
import { Bee_Farm, FN_add_bee_farm } from "../shared/Data_Models/Bee_Farm";
import {
  Bee_Hive,
  FN_add_bee_hive,
  IA_add_bee_hive,
} from "../shared/Data_Models/Bee_Hive";
import {
  Payload_Add,
  Payload_Remove,
  Payload_Set,
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

let add_bee_hive = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  let data = message_action as IA_add_bee_hive;

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

let add_bee = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  let data = message_action as IA_add_bee;

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
  let data = message_action as IA_remove_bee;

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
  let data: IA_set_bee_name = message_action as IA_set_bee_name;

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
    case FN_remove_bee:
      remove_bee(message_action, state);
      return;
    case FN_add_bee:
      add_bee(message_action, state);
      return;
    case FN_set_bee_name:
      set_bee_name(message_action, state);
      return;
  }
};
