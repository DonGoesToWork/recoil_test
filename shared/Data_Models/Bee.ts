import { CLASS_NAME_BEE } from "./Class_Names";
import { CLASS_NAME_BEE_HIVE } from "./Class_Names";
import { Data_Model_Base } from "./Data_Model_Base";
import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

// Interface Type(s) - Class definition as plain JS objects.

export interface IT_Bee extends Data_Model_Base {
  class_name: string;
  parent: string;
  children: string[];
  properties: {
    id: string;
    name: string;
    hive_id: string;
  };
  functions: {
    add: string;
    set_name: string;
  };
}

export const Bee: IT_Bee = {
  class_name: CLASS_NAME_BEE,
  parent: CLASS_NAME_BEE_HIVE,
  children: [],
  properties: {
    id: "id",
    name: "name",
    hive_id: "hive_id",
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
  hive_id: string;
}

// Interface Argument(s) - data sent to back-end for function calls.

export interface IA_bee_add extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  hive_id: string;
}

export interface IA_bee_set_name extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  bee_id: string;
  new_name: string;
}
