import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

export const CN_Bee_Farm: string = "Bee_Farm";

export interface Bee_Farm {
  id: string;
  name: string;
  hive_ids: string[]; // Array of IDs that refer to Beehives
}

export const FN_add_bee_farm: string = "add_bee_farm";

export interface IA_add_bee_farm extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
}
