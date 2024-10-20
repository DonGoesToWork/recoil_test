import { Bee_Farm, IA_bee_add_farm } from "../shared/Data_Models/Bee_Farm";

import { GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT } from "../shared/Data_Models/Generic_Remove";
import { iMessage_Sender } from "../Hive/HiveComponent";

export let remove_bee_farm = (function_send_message: iMessage_Sender, farm_id: string): void => {
  function_send_message(GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(Bee_Farm.class_name, farm_id));
};

export let add_bee_farm = (function_send_message: Function, farmer_id: string): void => {
  let data: IA_bee_add_farm = {
    object_class: Bee_Farm.class_name,
    function_name: Bee_Farm.functions.add,
    parent_id: farmer_id,
  };

  function_send_message(data);
};
