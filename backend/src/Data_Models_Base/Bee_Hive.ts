import {
  Bee_Hive,
  IA_bee_hive_add,
  IA_bee_hive_remove,
  IO_Bee_Hive,
} from "../shared/Data_Models/Bee_Hive";
import {
  Payload_Add,
  Payload_Remove,
  Pre_Message_Action_Send,
} from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";

let add_bee_hive = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  let data = message_action as IA_bee_hive_add;

  const newHive: IO_Bee_Hive = {
    id: `hive-${Date.now()}`,
    name: `Default Hive`,
    bee_ids: [],
    farm_id: data.farm_id,
  };

  const payload: Payload_Add = {
    objectType: Bee_Hive.class_name,
    object: newHive,
  };

  state.add(payload);
};

let remove_bee_hive = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  // Remove hive
  let data = message_action as IA_bee_hive_remove;

  const payload: Payload_Remove = {
    objectType: Bee_Hive.class_name,
    objectId: data.hive_id,
  };

  state.remove(payload);

  // Remove from class
  // state.remove__from_type_lists(CN_Bee_Hive, data.hive_id);

  // // delete from parents
  // state.remove_from_parent(CN_Bee_Farm, data.hive_id);

  // // delete children
  // state.remove_children(CN_Bee, data.hive_id);

  // Remove every bee from the the hive.
  // state.data[CN_Bee].forEach((bee: Bee) => {
  //   if (bee.hive_id === data.hive_id) {
  //     const payload: Payload_Remove = {
  //       objectType: CN_Bee,
  //       objectId: bee.id,
  //     };

  //     state.remove(payload);
  //   }
  // });
};

// * Register all back-end checks.
export let BC_Bee_Hive = (
  message_action: Pre_Message_Action_Send,
  state: Backend_State
): void => {
  switch (message_action.function_name) {
    case Bee_Hive.functions.add:
      add_bee_hive(message_action, state);
      return;
    case Bee_Hive.functions.remove:
      remove_bee_hive(message_action, state);
      return;
  }
};
