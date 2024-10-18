import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

// Class
export const CN_Bee: string = "Bee";

export interface Bee {
  id: string;
  name: string;
  hive_id: string; // Reference to the hive it belongs to
}

export const PROP_id: string = "id";
export const PROP_name: string = "name";
export const PROP_hive_id: string = "hive_id";

// Function
export const FN_bee_add: string = "add_bee";
export const FN_bee_remove: string = "remove_bee";
export const FN_bee_set_name: string = "set_bee_name";

// IA = Interface Args

export interface IA_bee_add extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  hive_id: string;
}

export interface IA_bee_remove extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  bee_id: string;
}

export interface IA_bee_set_name extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  bee_id: string;
  new_name: string;
}
