import { Pre_Message_Action_Send } from "../Communication/Communication_Interfaces";

export interface IA_object_remove extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  id: string;
}
