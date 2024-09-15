import { BC_Bee } from "../Bee";
import { BC_Bee_Farm } from "../Bee_Farm";
import { BC_Bee_Hive } from "../Bee_Hive";
import Backend_State from "../Backend_State/Backend_State";
import { CN_Bee } from "../../shared/Data_Models/Bee";
import { CN_Bee_Farm } from "../../shared/Data_Models/Bee_Farm";
import { CN_Bee_Hive } from "../../shared/Data_Models/Bee_Hive";
import { Pre_Message_Action_Send } from "../../shared/Communication/Communication_Interfaces";

export interface Class_Function {
  (message_action: Pre_Message_Action_Send, state: Backend_State): void;
}

export interface Object_Class_Function_Map {
  [object_class: string]: Class_Function;
}

export let Register_Objects = (x: Object_Class_Function_Map): void => {
  x[CN_Bee] = BC_Bee;
  x[CN_Bee_Farm] = BC_Bee_Farm;
  x[CN_Bee_Hive] = BC_Bee_Hive;
};
