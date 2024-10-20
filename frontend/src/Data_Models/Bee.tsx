import { Bee, IA_bee_add, IA_bee_set_name } from "../shared/Data_Models/Bee";

import { Bee_Hive } from "../shared/Data_Models/Bee_Hive";
import { GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT } from "../shared/Data_Models/Generic_Remove";
import { iMessage_Sender } from "../Hive/HiveComponent";

export let add_bee = (function_send_message: Function, hive_id: string): void => {
  let data: IA_bee_add = {
    object_class: Bee.class_name,
    function_name: Bee.functions.add,
    parent_id: hive_id,
  };

  function_send_message(data);
};

export let remove_bee = (function_send_message: iMessage_Sender, hive_id: string): void => {
  function_send_message(GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(Bee.class_name, hive_id));
};

export let set_bee_name = (function_send_message: Function, bee_id: string, new_name: string): void => {
  let data: IA_bee_set_name = {
    object_class: Bee.class_name,
    function_name: Bee.functions.set_name,
    bee_id: bee_id,
    new_name: new_name,
  };

  function_send_message(data);
};
