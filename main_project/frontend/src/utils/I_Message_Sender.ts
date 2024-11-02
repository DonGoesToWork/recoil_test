import { Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";

export interface I_Message_Sender {
  (update: Pre_Message_Action_Send): void;
}
