import {
  CLASS_NAME_BEE,
  CLASS_NAME_BEE_FARM,
  CLASS_NAME_BEE_HIVE,
} from "./Class_Names";

import { Bee_Farm } from "./Bee_Farm";
import { Data_Model_Base } from "./Data_Model_Base";
import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

// Interface Type(s) - Class definition as plain JS objects.

export interface IT_Bee_Hive extends Data_Model_Base {
  class_name: string;
  parent: string;
  children: string[];
  properties: {
    id: string;
    name: string;
    farm_id: string;
    bee_ids: string;
  };
  functions: {
    add: string;
  };
}

export const Bee_Hive: IT_Bee_Hive = {
  class_name: CLASS_NAME_BEE_HIVE,
  parent: CLASS_NAME_BEE_FARM,
  children: [CLASS_NAME_BEE],
  properties: {
    id: "id",
    name: "name",
    farm_id: "farm_id",
    bee_ids: "bee_ids",
  },
  functions: {
    add: "add_bee_hive",
  },
};

// Interface Object(s)

export interface IO_Bee_Hive {
  id: string;
  name: string;
  bee_ids: string[]; // Array of IDs that refer to Bees
  farm_id: string; // Reference to the farm it belongs to
}

// Interface Argument(s) - data sent to back-end for function calls.

export interface IA_bee_hive_add extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  farm_id: string;
}
