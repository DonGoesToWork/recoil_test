import { Farmer, IO_Farmer } from "../shared/Data_Models/Farmer";
import { Payload_Add, Pre_Message_Action_Send } from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";

let add_farmer = (state: Backend_State): void => {
  const newFarm: IO_Farmer = {
    id: `Farmer-${Date.now()}`,
    name: `Farmer Jenkins`,
    farm_ids: [],
  };

  const payload: Payload_Add = {
    objectType: Farmer.class_name,
    object: newFarm,
  };

  state.add(payload);
};

// Register all back-end checks

export let BC_Farmer = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  switch (message_action.function_name) {
    case Farmer.functions.add:
      add_farmer(state);
      return;
  }
};
