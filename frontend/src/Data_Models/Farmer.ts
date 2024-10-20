import { Farmer, IA_farmer_add } from "../shared/Data_Models/Farmer";

import { GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT } from "../shared/Data_Models/Generic_Remove";
import { iMessage_Sender } from "../Hive/HiveComponent";

export let remove_farmer = (function_send_message: iMessage_Sender, farm_id: string): void => {
  function_send_message(GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(Farmer.class_name, farm_id));
};

export let add_farmer = (function_send_message: Function): void => {
  let data: IA_farmer_add = {
    object_class: Farmer.class_name,
    function_name: Farmer.functions.add,
  };

  function_send_message(data);
};
