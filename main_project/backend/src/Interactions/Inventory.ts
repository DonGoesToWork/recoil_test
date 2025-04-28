import { IA_inventory_add_rpg_item, IA_inventory_remove_rpg_item, MO_Inventory, SO_Inventory } from "../z_generated/Shared_Data_Models/Inventory";
import { MO_Player_Inventory, SO_Player_Inventory } from "../z_generated/Shared_Data_Models/Player_Inventory";

import { DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME } from "../utils/IA_Remove";
import Shared_State from "../static_internal_logic/Shared_State";
import { delete_object_and_relations } from "../static_internal_logic/Generic_Remove";

// Club add/remove functions.

export let inventory_get_player_inventory = (state: Shared_State, inventory_id: string): SO_Player_Inventory | null => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);

  // find inventory whose player_id matches
  inventory = inventory.parent_id_data.player.filter((player_id: string) => player_id !== "");

  for (let id in inventory_get_all(state)) {
    if (inventory.club_id_data.player_inventory === id) {
      return so_player_inventory;
    }
  }

  console.log("Fatal error: Failed to find player inventory.");
  return null;
};

export let inventory_remove_player_inventory = (state: Shared_State, inventory_id: string): void => {
  let player_inventory: SO_Player_Inventory | null = inventory_get_player_inventory(state, inventory_id);

  if (!player_inventory) {
    return;
  }

  state.data[MO_Player_Inventory.class_name];

  // player_inventory_remove_inventory(state, player_inventory.id, inventory.id); (WILL BE GENERATED)
};

export let inventory_set_player_inventory = (state: Shared_State, inventory_id: string, player_inventory_id: string): void => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  inventory.club_id_data.player_inventory = player_inventory_id;
};

// Inventory can have Player and House as parent at same time.

export let inventory_add_rpg_item = (state: Shared_State, inventory_id: string, rpg_item_id: string) => {
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

export let inventory_get_unused_rpg_item_index = (state: Shared_State, inventory_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  //  return inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
  return "";
};

export let inventory_replace_rpg_item = (state: Shared_State, inventory_id: string, rpg_item_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  // let rpg_item_index = inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
  // inventory.rpg_item_ids.ids[rpg_item_index] = rpg_item_id;
  return "";
};

export let inventory_is_full_rpg_items = (state: Shared_State, inventory_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  return inventory.child_id_data.rpg_item.ids.length >= inventory.child_id_data.rpg_item.max_size;
};
