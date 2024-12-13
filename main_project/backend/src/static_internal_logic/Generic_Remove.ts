import { Payload_Delete, Payload_Set, Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";

import Backend_State from "./Backend_State";
import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";
import { Metadata_Object_Base } from "../z_generated/Shared_Misc/Metadata_Object_Base";

// tdoo, try to get function to fewer lines....
const get_parent_object_array_from_child = (state: Backend_State, metadata_object: Metadata_Object_Base, stateful_object: any): any => {
  const parent_data = metadata_object.parent_class_data;
  if (!parent_data) return null;
  console.log("DATA: ", stateful_object.parent_id_data);

  let entries: [string, string][] = Object.entries(stateful_object.parent_id_data);
  for (let [class_name, id] of entries) {
    if (id !== "") return state.get_object(class_name, id);
  }
};

// Supplamental method to clear gaps in a parent id list. (Compacts it).
export const clear_parent_id_list_gaps = (state: Backend_State, metadata_object: Metadata_Object_Base, stateful_object: any): void => {
  const parent_data = metadata_object.parent_class_data;
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

// Delete from parent(s)
let delete_from_parent = (state: Backend_State, metadata_object: Metadata_Object_Base, stateful_object: any) => {
  let parent_id_data = stateful_object.parent_id_data;
  let child_class_name = stateful_object.class_name;

  for (const parent_class_name of Object.keys(parent_id_data)) {
    let parent_id = parent_id_data[parent_class_name];
    const parent_object = state.data[parent_class_name][parent_id];
    parent_object.parent_id_data[child_class_name] = "-1";

    // create set payloads
    const payload: Payload_Set = {
      object_type: parent_object.class_name,
      id: parent_id,
      property_name: parent_id_data,
      property_value: parent_object.parent_id_data, // DAR TOOD -> Future optimization -> only set/send sub-property rather than whole array.
    };

    state.set(payload);
  }
};

let delete_children_recursively = (state: Backend_State, metadata_object: Metadata_Object_Base, object_id: string) => {
  // Var inits
  let child_class_data_list: string[] = metadata_object.child_class_data_list;

  // If no children, then delete the object.
  if (child_class_data_list == undefined || child_class_data_list == null || child_class_data_list.length == 0) {
    return;
  }

  child_class_data_list.forEach((child_class_name: string) => {
    let children_objects = state.data[child_class_name];

    if (children_objects == undefined || children_objects == null) {
      return;
    }

    // Recursively delete children
    let children_objects_entries: [string, any][] = Object.entries(children_objects);

    children_objects_entries.forEach(([id, object]: [string, any]) => {
      console.log("OBJECT PARENT ID: ", object.parent_id);

      if (object.parent_id === object_id) {
        delete_children_recursively(state, GLOBAL_CLASS_MAP[object.class_name], id);
        delete_object(state, object.class_name, id);
      }
    });

    // Old, todo remove after more validation.
    // children_objects_entries.forEach((child: any) => {
    //   // Skip non-children.
    //   if (child.parent_id !== object_id) {
    //     return;
    //   }

    //   // Remove children recursively.
    //   delete_children_recursively(state, GLOBAL_CLASS_MAP[child_class_data.class_name], child.id);

    //   // Delete this object.
    //   delete_object(state, child_class_data.class_name, child.id);
    // });
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
      console.log("Fatal error: Can't delete object - " + metadata_object_name + " - Object array not found.");
      return;
    }

    if (!data.id) {
      console.log("Fatal error: Can't delete object - " + metadata_object_name + " - Object has no id.");
      return;
    }

    // find so object using id:
    let so_object: any = object_array[data.id]; // .find((object: any) =>  === metadata_object_id)

    // Sanity check.
    if (!so_object) {
      console.log("Fatal error: Can't delete object - " + metadata_object_name + " - Object not found at id: " + metadata_object_id);
      return;
    }

    delete_from_parent(state, metadata_object, so_object);
    delete_children_recursively(state, metadata_object, metadata_object_id);
    delete_object(state, metadata_object.class_name, metadata_object_id);
  } else {
    console.log("Error, tried to delete object with no id. Removal objects should always have an id: ", metadata_object_name, data);
  }
};
