import { Child_Class_Data, Metadata_Object_Base } from "../z_generated/Shared_Misc/Metadata_Object_Base";
import { Payload_Delete, Payload_Set, Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";

import Backend_State from "./Backend_State";
import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";

const get_parent_object_array_from_child = (state: Backend_State, metadata_object: Metadata_Object_Base, stateful_object: any): any => {
  const parent_data = metadata_object.parent_data;

  if (!parent_data) return null;

  // If our metadata object has a non-null parent_data field, then our stateful object MUST have parent-related fields too.
  // This is a safe assumption to make given the logic of the application.
  let parent_class_name = stateful_object.parent_class_name;

  // We still do sanity checks anyway though...
  if (!parent_class_name) {
    console.log("Fatal error: failed to find parent class name for parent object: " + stateful_object.class_name + " child object: " + metadata_object.class_name + " stateful object: " + stateful_object.class_name);
    return null;
  }

  let parent_object_array = state.data[parent_class_name];

  if (!parent_object_array) {
    console.log("Fatal error: failed to find parent object array for string: " + parent_class_name);
    return null;
  }

  return parent_object_array;
};

// Supplamental method to clear gaps in a parent id list. (Compacts it).
export const clear_parent_id_list_gaps = (state: Backend_State, metadata_object: Metadata_Object_Base, stateful_object: any): void => {
  const parent_data = metadata_object.parent_data;
  let parent_object_array = get_parent_object_array_from_child(state, metadata_object, stateful_object);

  if (!parent_data) {
    console.log("Fatal error: No parent data for: ", metadata_object.class_name);
    return;
  }

  if (!parent_object_array) {
    return;
  }

  parent_object_array.some((parent_object: any) => {
    const id_list: string[] = parent_object[parent_data.id_list_name];

    if (!id_list) {
      console.log("Fatal error. No child id list for parent object: " + parent_object.class_name);
      return false;
    }

    parent_object[parent_data.id_list_name] = id_list.filter((id: string) => id !== "");
    return true;
  });
};

// Delete from parents.
let delete_from_parent = (state: Backend_State, metadata_object: Metadata_Object_Base, stateful_object: any) => {
  const parent_data = metadata_object.parent_data;
  let parent_object_array = get_parent_object_array_from_child(state, metadata_object, stateful_object);

  // Warn when objects with no parents are deleted as they are likely to be very important.
  // - ie. a root-level application state object
  if (!parent_data) {
    console.log("Warning: Deleting object with no parents: " + metadata_object.class_name);
    return;
  }

  if (!parent_object_array) {
    return;
  }

  let parent_id_list_name = parent_data.id_list_name;
  let stateful_object_id = stateful_object.id;

  // Find the first parent object that includes our child object id and then filter out our child id from its property list.
  parent_object_array.some((parent_object: any) => {
    const id_list: string[] = parent_object[parent_id_list_name];

    // return false when parent object does not include our child id
    if (!id_list || id_list.indexOf(stateful_object_id) === -1) {
      return false;
    }

    // filter id_list to no longer include our child (the base object id)
    // We always clear fields. Never delete. (This is to preserve spaces).
    id_list.some((id: string) => {
      if (id === stateful_object_id) {
        id = "";
        return true;
      }
      return false;
    });

    // sent the payload
    const payload: Payload_Set = {
      object_type: parent_object.class_name,
      id: parent_object.id,
      property_name: parent_id_list_name,
      property_value: id_list,
    };

    state.set(payload);
    return true; // only 1 parent per object, so return on first success
  });
};

let delete_children_recursively = (state: Backend_State, metadata_object: Metadata_Object_Base, object_id: string) => {
  // Var inits
  let child_class_data_list: Child_Class_Data[] = metadata_object.child_class_data_list;

  // If no children, then delete the object.
  if (child_class_data_list == undefined || child_class_data_list == null || child_class_data_list.length == 0) {
    return;
  }

  child_class_data_list.forEach((child_class_data: Child_Class_Data) => {
    let children_objects = state.data[child_class_data.class_name];

    if (children_objects == undefined || children_objects == null) {
      return;
    }

    // Recursively delete children
    children_objects.forEach((child: any) => {
      // Skip non-children.
      if (child.parent_id !== object_id) {
        return;
      }

      // Remove children recursively.
      delete_children_recursively(state, GLOBAL_CLASS_MAP[child_class_data.class_name], child.id);

      // Delete this object.
      delete_object(state, child_class_data.class_name, child.id);
    });
  });
};

let delete_object = (state: Backend_State, object_class_name: string, object_id: string): void => {
  const payload: Payload_Delete = {
    object_type: object_class_name,
    objectId: object_id,
  };

  state.delete(payload);
};

// deletes parent, children and base object - only method that should be called directly in this file
export let delete_object_and_relations = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let metadata_object_name = message_action.object_class;
  let metadata_object: Metadata_Object_Base = GLOBAL_CLASS_MAP[metadata_object_name];
  let data = message_action;
  let metadata_object_id: string | undefined = data.id;

  if (metadata_object_id !== undefined && metadata_object_id !== null) {
    let object_array = state.data[metadata_object_name];

    // Sanity check.
    if (!object_array) {
      console.log("Fatal error: Can't delete object " + metadata_object_name + " - Object array not found.");
      return;
    }

    // find so object using id:
    let so_object: any = object_array.find((object: any) => object.id === metadata_object_id);

    // Sanity check.
    if (!so_object) {
      console.log("Fatal error: Can't delete object " + metadata_object_name + " - Object not found at id: " + metadata_object_id);
      return;
    }

    delete_from_parent(state, metadata_object, so_object);
    delete_children_recursively(state, metadata_object, metadata_object_id);
    delete_object(state, metadata_object.class_name, metadata_object_id);
  } else {
    console.log("Error, tried to delete object with no id. Removal objects should always have an id: ", metadata_object_name, data);
  }
};
