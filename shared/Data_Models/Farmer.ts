import { CLASS_NAME_BEE_FARM, CLASS_NAME_FARMER } from "./Class_Names";

import { Data_Model_Base } from "./Data_Model_Base";
import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

// Interface Type(s) - Class definition as plain JS objects.

export interface IT_Farmer extends Data_Model_Base {
  class_name: string;
  properties: {
    id: string;
    name: string;
    farm_ids: string;
  };
  functions: {
    add: string;
  };
}

export const Farmer: IT_Farmer = {
  class_name: CLASS_NAME_FARMER,
  parent_data: null,
  child_class_name_list: [CLASS_NAME_BEE_FARM],
  properties: {
    id: "id",
    name: "name",
    farm_ids: "farm_ids",
  },
  functions: {
    add: "add_farmer",
  },
};

// Interface Object(s)

export interface IO_Farmer {
  id: string;
  name: string;
  farm_ids: string[];
}

// Interface Argument(s) - data sent to back-end for function calls.

export interface IA_farmer_add extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
}
