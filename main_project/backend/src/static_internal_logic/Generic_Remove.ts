import { Child_Class_Data, Data_Model_Base } from "../z_generated/Shared_Misc/Data_Model_Base";
import { Payload_Delete, Payload_Set, Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";

import Backend_State from "./Backend_State";
import { GLOBAL_CLASS_MAP } from "../z_generated/Global_Class_Map/Global_Class_Map";

// Supplamental method to clear gaps in a parent id list. (Compacts it).
export const clear_parent_id_list_gaps = (state: Backend_State, base_object: Data_Model_Base, object_id: string): void => {
  const parent_data = base_object.parent_data;
  if (!parent_data) return;

  const parent_objects = state.data[parent_data.class_name];
  if (!parent_objects) return;

  parent_objects.some((parent_object: any) => {
    const id_list: string[] = parent_object[parent_data.id_list_name];
    if (!id_list || !id_list.includes(object_id)) return false;
    parent_object[parent_data.id_list_name] = id_list.filter(Boolean);
  });
};

// Delete from parents.
let delete_from_parent = (state: Backend_State, base_object: Data_Model_Base, object_id: string) => {
  // Var inits
  let parent_data = base_object.parent_data;

  if (parent_data == undefined || parent_data == null) {
    return;
  }

  let parent_data_model: Data_Model_Base = GLOBAL_CLASS_MAP[parent_data.class_name];
  let parent_object_id_list: string = parent_data_model.properties[parent_data.id_list_name];
  let parent_objects = state.data[parent_data.class_name];

  // Find the first parent object that includes our child object id and then filter out our child id from its property list.
  parent_objects.some((parent_object: any) => {
    let id_list: string[] = parent_object[parent_object_id_list];

    // return false when parent object does not include our child id
    if (parent_object[parent_object_id_list] == undefined || parent_object[parent_object_id_list] == null || parent_object[parent_object_id_list].indexOf(object_id) === -1) {
      return false;
    }

    // filter id_list to no longer include our child (the base object id)
    // We always clear fields. Never delete. (This is to preserve spaces).
    id_list.some((id: string) => {
      if (id === object_id) {
        id = "";
        return true;
      }
      return false;
    });

    // sent the payload
    const payload: Payload_Set = {
      objectType: parent_object.class_name,
      id: parent_object.id,
      propertyName: parent_object_id_list,
      propertyValue: id_list,
    };

    state.set(payload);
    return true; // only 1 parent per object, so return on first success
  });
};

let delete_children_recursively = (state: Backend_State, base_object: Data_Model_Base, object_id: string) => {
  // Var inits
  let child_class_data_list: Child_Class_Data[] = base_object.child_class_data_list;

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
    objectType: object_class_name,
    objectId: object_id,
  };

  state.delete(payload);
};

// deletes parent, children and base object - only method that should be called directly in this file
export let delete_object_and_relations = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let base_object_name = message_action.object_class;
  let base_object: Data_Model_Base = GLOBAL_CLASS_MAP[base_object_name];
  let data = message_action;
  let base_object_id: string | undefined = data.id;

  if (base_object_id !== undefined && base_object_id !== null) {
    delete_from_parent(state, base_object, base_object_id);
    delete_children_recursively(state, base_object, base_object_id);
    delete_object(state, base_object.class_name, base_object_id);
  } else {
    console.log("Error, tried to delete object with no id. Removal objects should always have an id: ", base_object_name, data);
  }
};
