import { Register_Bee } from "./Data_Models_Base/Bee";
import { Register_Bee_Hive } from "./Data_Models_Base/Bee_Hive";
import { Register_Bee_Farm } from "./Data_Models_Base/Bee_Farm";
import { Register_Farmer } from "./Data_Models_Base/Farmer";
import { Register_Player } from "./Data_Models_Base/Player";

import Backend_State from "./static_internal_logic/Backend_State";
import { Pre_Message_Action_Send } from "./shared/Communication/Communication_Interfaces";

export interface Class_Function {
  (message_action: Pre_Message_Action_Send, state: Backend_State): void;
}

export interface Object_Class_Function_Map {
  [key: string]: { [key: string]: Class_Function };
}

export let Register_Objects = (x: Object_Class_Function_Map): void => {
  Register_Bee(x);
  Register_Bee_Hive(x);
  Register_Bee_Farm(x);
  Register_Farmer(x);
  Register_Player(x);
};