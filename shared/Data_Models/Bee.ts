import { Bee_Hive } from "./Bee_Hive";
import { CLASS_NAME_BEE } from "./Class_Names";
import { Data_Model_Base } from "./Data_Model_Base";
import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

// Interface Type(s) - Class definition as plain JS objects.

export interface IT_Bee extends Data_Model_Base {
  class_name: string;
  properties: {
    id: string;
    name: string;
    parent_id: string;
  };
  functions: {
    add: string;
    set_name: string;
  };
}

export const Bee: IT_Bee = {
  class_name: CLASS_NAME_BEE,
  parent_data: {
    class_name: Bee_Hive.class_name,
    id_list_name: "bee_ids",
  },
  child_class_name_list: [],
  properties: {
    id: "id",
    name: "name",
    parent_id: "parent_id",
  },
  functions: {
    add: "bee_add",
    set_name: "bee_set_name",
  },
};

// Interface Object(s)

export interface IO_Bee {
  id: string;
  name: string;
  parent_id: string;
}

// Interface Argument(s) - data sent to back-end for function calls.

export interface IA_bee_add extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  parent_id: string;
}

export interface IA_bee_set_name extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  bee_id: string;
  new_name: string;
}
