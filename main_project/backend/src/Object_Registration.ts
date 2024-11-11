import Backend_State from "./static_internal_logic/Backend_State";
import { Pre_Message_Action_Send } from "./z_generated/Shared_Misc/Communication_Interfaces";
import { Register_Bee } from "./z_generated/Data_Models/Bee";
import { Register_Bee_Hive } from "./z_generated/Data_Models/Bee_Hive";
import { Register_Bee_Farm } from "./z_generated/Data_Models/Bee_Farm";
import { Register_Farmer } from "./z_generated/Data_Models/Farmer";
import { Register_Player } from "./z_generated/Data_Models/Player";
import { Register_Inventory } from "./z_generated/Data_Models/Inventory";
import { Register_Item } from "./z_generated/Data_Models/Item";

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
  Register_Inventory(x);
  Register_Item(x);
};