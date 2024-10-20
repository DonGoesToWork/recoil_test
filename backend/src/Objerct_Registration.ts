import { CLASS_NAME_BEE, CLASS_NAME_BEE_FARM, CLASS_NAME_BEE_HIVE, CLASS_NAME_FARMER } from "./shared/Data_Models/Class_Names";

import { BC_Bee } from "./Data_Models_Base/Bee";
import { BC_Bee_Farm } from "./Data_Models_Base/Bee_Farm";
import { BC_Bee_Hive } from "./Data_Models_Base/Bee_Hive";
import { BC_Farmer } from "./Data_Models_Base/Farmer";
import Backend_State from "./static_internal_logic/Backend_State";
import { Pre_Message_Action_Send } from "./shared/Communication/Communication_Interfaces";

export interface Class_Function {
  (message_action: Pre_Message_Action_Send, state: Backend_State): void;
}

export interface Object_Class_Function_Map {
  [object_class: string]: Class_Function;
}

export let Register_Objects = (x: Object_Class_Function_Map): void => {
  x[CLASS_NAME_BEE] = BC_Bee;
  x[CLASS_NAME_BEE_FARM] = BC_Bee_Farm;
  x[CLASS_NAME_BEE_HIVE] = BC_Bee_Hive;
  x[CLASS_NAME_FARMER] = BC_Farmer;
};
