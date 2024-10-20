import { Bee_Hive, IA_bee_hive_add } from "../shared/Data_Models/Bee_Hive";

import { GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT } from "../shared/Data_Models/Generic_Remove";
import { iMessage_Sender } from "../Hive/HiveComponent";

export let add_bee_hive = (function_send_message: iMessage_Sender, farm_id: string): void => {
  let data: IA_bee_hive_add = {
    object_class: Bee_Hive.class_name,
    function_name: Bee_Hive.functions.add,
    parent_id: farm_id,
  };

  function_send_message(data);
};

export let remove_bee_hive = (function_send_message: iMessage_Sender, hive_id: string): void => {
  function_send_message(GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(Bee_Hive.class_name, hive_id));
};
