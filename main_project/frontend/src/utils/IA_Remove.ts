// Manually shared file between front and back-end
// (manually share because this is an infrastructure file that should never change.)

export interface IA_Object_Remove {
  object_class: string;
  function_name: string;
  id: string;
}

export const DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME: string = "generic_object_removal_function";

// front-end creates IA removal objects (as it does with all Interface Actions).
export function GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(object_class: string, id: string): IA_Object_Remove {
  return {
    object_class: object_class,
    function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
    id: id,
  };
}
