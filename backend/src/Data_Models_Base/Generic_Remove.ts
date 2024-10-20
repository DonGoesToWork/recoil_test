import { Payload_Remove, Payload_Set, Pre_Message_Action_Send } from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";
import { Data_Model_Base } from "../shared/Data_Models/Data_Model_Base";
import { GLOBAL_CLASS_MAP } from "../shared/Data_Models/Global_Class_Map";
import { IA_Object_Remove } from "../shared/Data_Models/Generic_Remove";

// todo replace 'id' with static var.

// Delete from parents.
let remove_from_parent = (state: Backend_State, base_object: Data_Model_Base, object_id: string) => {
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
    let id_list = parent_object[parent_object_id_list];

    // return false when parent object does not include our child id
    if (parent_object[parent_object_id_list].indexOf(object_id) === -1) {
      return false;
    }

    // filter id_list to no longer include our child (the base object id)
    id_list = id_list.filter((id: string) => id !== object_id);

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

let remove_children_recursively = (state: Backend_State, base_object: Data_Model_Base, object_id: string) => {
  // Var inits
  let child_class_names: string[] = base_object.child_class_name_list;

  // If no children, then delete the object.
  if (child_class_names == undefined || child_class_names == null || child_class_names.length == 0) {
    console.log("Children blank.");
    return;
  }

  child_class_names.forEach((child_class_name: string) => {
    let children_objects = state.data[child_class_name];

    console.log("1 - ", child_class_name, children_objects);

    // Recursively remove children
    children_objects.forEach((child: any) => {
      console.log("2 - ", child.parent_id);

      // Skip non-children.
      if (child.parent_id !== object_id) {
        console.log("3 - Rejected: ", child.class_name);
        return;
      }

      // Remove children recursively.
      remove_children_recursively(state, child, child.id);

      // Delete this object.
      remove_object(state, child_class_name, child.id);
    });
  });
};

let remove_object = (state: Backend_State, object_class_name: string, object_id: string): void => {
  console.log("X - Removing: ", object_id);

  const payload: Payload_Remove = {
    objectType: object_class_name,
    objectId: object_id,
  };

  state.remove(payload);
};

// removes parent, children and base object
export let remove_full = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let base_object_name = message_action.object_class;
  let base_object: Data_Model_Base = GLOBAL_CLASS_MAP[base_object_name];
  let data = message_action as IA_Object_Remove;
  let base_object_id = data.id;

  remove_from_parent(state, base_object, base_object_id);
  remove_children_recursively(state, base_object, base_object_id);
  remove_object(state, base_object.class_name, base_object_id);
};
