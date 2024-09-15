import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

// Class
export const CN_Bee: string = "Bee";

export interface Bee {
  id: string;
  name: string;
  hive_id: string; // Reference to the hive it belongs to
}

// Function
export const FN_add_bee: string = "add_bee";
export const FN_remove_bee: string = "remove_bee";
export const FN_set_bee_name: string = "set_bee_name";

// IA = Interface Args

export interface IA_add_bee extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  hive_id: string;
}

export interface IA_remove_bee extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  bee_id: string;
}

export interface IA_set_bee_name extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  bee_id: string;
  new_name: string;
}
