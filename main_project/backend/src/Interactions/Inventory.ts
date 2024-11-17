import { IO_Inventory, IS_Inventory } from "../z_generated/Shared_Data_Models/Inventory";
import { clear_parent_id_list_gaps, delete_object_and_relations } from "../static_internal_logic/Generic_Remove";

import Backend_State from "../static_internal_logic/Backend_State";
import { DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME } from "../utils/IA_Remove";
import { GLOBAL_CLASS_MAP } from "../z_generated/Global_Class_Map/Global_Class_Map";
import { IO_Rpg_Item } from "../z_generated/Shared_Data_Models/Rpg_Item";
import { Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";

// interaction middleware function to fill

// DEV: Add function to interactions:

export const iam_inventory_add_rpg_item = (state: Backend_State, inventory_id: string, rpg_item_id: string): void => {
  // Sample Snippets:
  // let inventory: IO_Inventory = inventory_get(state, inventory_id);
  // let rpg_item: IO_Rpg_Item = rpg_item_get(state, rpg_item_id);
  // inventory_add_rpg_item(state, inventory_id, rpg_item_id)
};

// More Default Generated Functions

let inventory_get = (state: Backend_State, inventory_id: string): IO_Inventory => {
  return state.data["inventory"].find((inventory: IO_Inventory) => inventory.id === inventory_id);
};

let inventory_delete = (state: Backend_State, inventory_id: string) => {
  let msg: Pre_Message_Action_Send = {
    object_class: "inventory",
    function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
    id: inventory_id,
  };
  delete_object_and_relations(msg, state); // <- set based on
};

let inventory_is_full = (state: Backend_State, inventory_id: string) => {
  let inventory: IO_Inventory = inventory_get(state, inventory_id);
  return inventory.rpg_item_ids.ids.length >= inventory.rpg_item_ids.max_size;
};

let inventory_get_parent = (state: Backend_State, inventory_id: string) => {
  return state.data["inventory"].find((inventory: IO_Inventory) => inventory.id === inventory_id)?.parent_id;
};

//  Default Functions to Generate for every child object.

let inventory_get_rpg_item = (state: Backend_State, inventory: string | IO_Inventory, rpg_item_id: string): IO_Rpg_Item | undefined => {
  const inventory_id = typeof inventory === "string" ? inventory : inventory.id;
  return state.data["rpg_item"].find((rpg_item: IO_Rpg_Item) => rpg_item.parent_id === inventory_id)?.find((rpg_item: IO_Rpg_Item) => rpg_item.id === rpg_item_id);
};

let inventory_get_rpg_items = (state: Backend_State, inventory: string | IO_Inventory): IO_Rpg_Item[] => {
  const inventory_id = typeof inventory === "string" ? inventory : inventory.id;
  return state.data["rpg_item"].filter((rpg_item: IO_Rpg_Item) => rpg_item.parent_id === inventory_id);
};

let inventory_remove_rpg_item = (state: Backend_State, rpg_item_id: string, _clear_parent_id_list_gaps: boolean, _inventory_id?: string | IO_Inventory): void => {
  const inventory_id: string | undefined = typeof _inventory_id === "string" ? _inventory_id : _inventory_id?.id;
  const rpg_item_index = state.data["rpg_item"].findIndex((rpg_item: IO_Rpg_Item) => rpg_item.id === rpg_item_id && (!inventory_id || rpg_item.parent_id === inventory_id));

  if (rpg_item_index !== -1) {
    let message: Pre_Message_Action_Send = {
      object_class: "Rpg_Item",
      function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
      id: state.data["rpg_item"][rpg_item_index].id,
    };
    delete_object_and_relations(message, state);

    if (_clear_parent_id_list_gaps) {
      clear_parent_id_list_gaps(state, GLOBAL_CLASS_MAP["Rpg_Item"], state.data["rpg_item"][rpg_item_index]);
    }
  }
};

let inventory_add_rpg_item = (state: Backend_State, inventory_id: string, rpg_item_id: string) => {
  if (inventory_is_full(state, inventory_id)) {
    return;
  }

  let inventory = inventory_get(state, inventory_id);
  // let rpg_item = rpg_item_get(state, rpg_item_id); // TODO - READD

  // Add item to first index of inventory 'rpg item ids' that is null.
  let rpg_item_index = inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");

  // Should never equal -1.
  if (rpg_item_index === -1) {
    console.log("Critical error. No free spot found!");
    return;
  }

  // nventory.rpg_item_ids.ids[rpg_item_index] = rpg_item.id; // TODO - READD
};

let inventory_get_unused_rpg_item_index = (state: Backend_State, inventory_id: string) => {
  let inventory: IO_Inventory = inventory_get(state, inventory_id);
  return inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
};

let inventory_replace_rpg_item = (state: Backend_State, inventory_id: string, rpg_item_id: string) => {
  let inventory: IO_Inventory = inventory_get(state, inventory_id);
  let rpg_item_index = inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
  inventory.rpg_item_ids.ids[rpg_item_index] = rpg_item_id;
};
