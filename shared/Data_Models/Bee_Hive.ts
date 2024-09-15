import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

export const CN_Bee_Hive: string = "Bee_Hive";

export interface Bee_Hive {
  id: string;
  name: string;
  bee_ids: string[]; // Array of IDs that refer to Bees
  farm_id: string; // Reference to the farm it belongs to
}

export const FN_add_bee_hive: string = "add_bee_hive";

export interface IA_add_bee_hive extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  farm_id: string;
}
