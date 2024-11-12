// Manually shared file between front and back-end
// (manually share because this is an infrastructure file that should never change.)

import { Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";

export const DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME: string = "generic_object_removal_function";

// front-end creates IA removal objects (as it does with all Interface Actions).
export function GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(object_class: string, id: string): Pre_Message_Action_Send {
  return {
    object_class: object_class,
    function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
    id: id,
  };
}
