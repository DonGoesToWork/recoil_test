import { IA_inventory_add_rpg_item, IA_inventory_remove_rpg_item, MO_Inventory, SO_Inventory } from "../z_generated/Shared_Data_Models/Inventory";
import { MO_Player_Inventory, SO_Player_Inventory } from "../z_generated/Shared_Data_Models/Player_Inventory";
import { clear_parent_id_list_gaps, delete_object_and_relations } from "../static_internal_logic/Generic_Remove";

import Backend_State from "../static_internal_logic/Backend_State";
import { DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME } from "../utils/IA_Remove";

// interaction middleware function to fill

export const iam_inventory_add_rpg_item = (state: Backend_State, data: IA_inventory_add_rpg_item): void => {
  // Sample Snippets:
  // let inventory: SO_Inventory = inventory_get(state, data.inventory_id);
  // let rpg_item: SO_Rpg_Item = rpg_item_get(state, data.rpg_item_id);
  // inventory_add_rpg_item(state, data.inventory_id, data.rpg_item_id);
};

export const iam_inventory_remove_rpg_item = (state: Backend_State, data: IA_inventory_remove_rpg_item): void => {
  // Sample Snippets:
  // let inventory: SO_Inventory = inventory_get(state, data.inventory_id);
  // let rpg_item: SO_Rpg_Item = rpg_item_get(state, data.rpg_item_id);
  // inventory_add_rpg_item(state, data.inventory_id, data.rpg_item_id);
};

// More Default Generated Functions

export let inventory_get = (state: Backend_State, inventory_id: string): SO_Inventory => {
  return state.data["inventory"][inventory_id];
};

export let inventory_delete = (state: Backend_State, inventory_id: string) => {
  delete_object_and_relations(
    {
      object_class: MO_Inventory.class_name,
      function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
      id: inventory_id,
    },
    state
  );
};

// Parent add/remove functions

export let inventory_set_player = (state: Backend_State, inventory_id: string, player_id: string): void => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  inventory.parent_id_data.player = player_id;
};

export let inventory_remove_player = (state: Backend_State, inventory_id: string): void => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  inventory.parent_id_data.player = "";
};

// Club add/remove functions.

export let inventory_get_player_inventory = (state: Backend_State, inventory_id: string): SO_Player_Inventory | null => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);

  for (let so_player_inventory of state.data[MO_Player_Inventory.class_name]) {
    if (inventory.club_id_data.player_inventory === so_player_inventory.id) {
      return so_player_inventory;
    }
  }

  console.log("Fatal error: Failed to find player inventory.");
  return null;
};

export let inventory_remove_player_inventory = (state: Backend_State, inventory_id: string): void => {
  let player_inventory: SO_Player_Inventory | null = inventory_get_player_inventory(state, inventory_id);

  if (!player_inventory) {
    return;
  }

  state.data[MO_Player_Inventory.class_name];

  // player_inventory_remove_inventory(state, player_inventory.id, inventory.id); (WILL BE GENERATED)
};

export let inventory_set_player_inventory = (state: Backend_State, inventory_id: string, player_inventory_id: string): void => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  inventory.club_id_data.player_inventory = player_inventory_id;
};

// Inventory can have Player and House as parent at same time.

export let inventory_add_rpg_item = (state: Backend_State, inventory_id: string, rpg_item_id: string) => {
  if (inventory_is_full_rpg_items(state, inventory_id)) {
    return;
  }

  let inventory = inventory_get(state, inventory_id);
  // let rpg_item = rpg_item_get(state, rpg_item_id); // TODO - READD

  // Add item to first index of inventory 'rpg item ids' that is null.
  // et rpg_item_index = inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");

  // Should never equal -1.
  // if (rpg_item_index === -1) {
  //   console.log("Critical error. No free spot found!");
  //   return;
  // }

  // nventory.rpg_item_ids.ids[rpg_item_index] = rpg_item.id; // TODO - READD
};

export let inventory_get_unused_rpg_item_index = (state: Backend_State, inventory_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  //  return inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
  return "";
};

export let inventory_replace_rpg_item = (state: Backend_State, inventory_id: string, rpg_item_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  // let rpg_item_index = inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
  // inventory.rpg_item_ids.ids[rpg_item_index] = rpg_item_id;
  return "";
};

export let inventory_is_full_rpg_items = (state: Backend_State, inventory_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  return inventory.child_id_data.rpg_item.ids.length >= inventory.child_id_data.rpg_item.max_size;
};
