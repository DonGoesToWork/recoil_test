import { CLASS_NAME_BEE_FARM, CLASS_NAME_BEE_HIVE } from "./Class_Names";

import { Data_Model_Base } from "./Data_Model_Base";
import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

// Interface Type(s) - Class definition as plain JS objects.

export interface IT_Bee_Farm extends Data_Model_Base {
  class_name: string;
  properties: {
    id: string;
    name: string;
    hive_ids: string;
  };
  functions: {
    add: string;
  };
}

export const Bee_Farm: IT_Bee_Farm = {
  class_name: CLASS_NAME_BEE_FARM,
  parent_data: null,
  child_class_name_list: [CLASS_NAME_BEE_HIVE],
  properties: {
    id: "id",
    name: "name",
    hive_ids: "hive_ids",
  },
  functions: {
    add: "add_bee_farm",
  },
};

// Interface Object(s)

export interface IO_Bee_Farm {
  id: string;
  name: string;
  hive_ids: string[];
}

// Interface Argument(s) - data sent to back-end for function calls.

export interface IA_bee_add_farm extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
}
