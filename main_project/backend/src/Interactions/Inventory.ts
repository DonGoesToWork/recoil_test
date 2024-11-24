import { IA_inventory_add_rpg_item, IA_inventory_remove_rpg_item, SO_Inventory } from "../z_generated/Shared_Data_Models/Inventory";
import { MO_Player_Inventory, SO_Player_Inventory } from "../z_generated/Shared_Data_Models/Player_Inventory";
import { MO_Rpg_Item, SO_Rpg_Item } from "../z_generated/Shared_Data_Models/Rpg_Item";
import { clear_parent_id_list_gaps, delete_object_and_relations } from "../static_internal_logic/Generic_Remove";

import Backend_State from "../static_internal_logic/Backend_State";
import { DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME } from "../utils/IA_Remove";
import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";
import { MO_Player, SO_Player } from "../z_generated/Shared_Data_Models/Player";
import { Payload_Set, Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";

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

WIP

export let inventory_get = (state: Backend_State, inventory_id: string): SO_Inventory => {
  return state.data["inventory"][inventory_id];
};

export let inventory_delete = (state: Backend_State, inventory_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  
  // Clear all parent id fields.
  inventory.parent_data.player_id = "";

  // This code would be in player normally I imagine under player_remove_inventory.
  let player_id = inventory.parent_data.player_id;
  let player: SO_Player = state.data[MO_Player.class_name][player_id];
  player.child


  player[]
  let set_payload: Payload_Set = {
    object_class: MO_Player.class_name,
    function_name: MO_Player.functions.set,
  }

  state.data[MO_Player.class_name][d];

  for (let [key, value] of Object.entries(inventory.parent_data)) {
    // Get the parent by id
    state.data[value].findIndex((inventory: SO_Inventory) => inventory.id === inventory_id);
  }

  let msg: Pre_Message_Action_Send = {
    object_class: "inventory",
    function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
    id: inventory_id,
  };

  delete_object_and_relations(msg, state); // <- set based on
};

export let inventory_is_full = (state: Backend_State, inventory_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  return inventory.rpg_item_ids.ids.length >= inventory.rpg_item_ids.max_size;
};

// Parent add/remove functions

export let inventory_set_player = (state: Backend_State, inventory_id: string, player_id: string): void => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  inventory.parent_data.player_id = player_id;
};

export let inventory_remove_player = (state: Backend_State, inventory_id: string): void => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  inventory.parent_data.player_id = "";
};

// Club add/remove functions.

export let inventory_get_club_player_inventory = (state: Backend_State, inventory_id: string): SO_Player_Inventory | null => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);

  for (let so_player_inventory of state.data[MO_Player_Inventory.class_name]) {
    if (inventory.club_data.player_inventory_id === so_player_inventory.id) {
      return so_player_inventory;
    }
  }

  console.log("Fatal error: Failed to find player inventory.");
  return null;
};

export let inventory_remove_club_player_inventory = (state: Backend_State, inventory_id: string): void => {
  let player_inventory: SO_Player_Inventory | null = inventory_get_club_player_inventory(state, inventory_id);

  if (!player_inventory) {
    return;
  }

  state.data[MO_Player_Inventory.class_name];

  // player_inventory_remove_inventory(state, player_inventory.id, inventory.id); (WILL BE GENERATED)
};

export let inventory_set_player_inventory = (state: Backend_State, inventory_id: string, player_inventory_id: string): void => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  inventory.club_data.player_inventory_id = player_inventory_id;
};

//  Default Functions to Generate for every child object.

export let inventory_get_rpg_item = (state: Backend_State, inventory: string | SO_Inventory, rpg_item_id: string): SO_Rpg_Item | undefined => {
  const inventory_id = typeof inventory === "string" ? inventory : inventory.id;
  return state.data[MO_Rpg_Item.class_name].find((rpg_item: SO_Rpg_Item) => rpg_item.parent_id === inventory_id)?.find((rpg_item: SO_Rpg_Item) => rpg_item.id === rpg_item_id);
};

export let inventory_get_rpg_items = (state: Backend_State, inventory: string | SO_Inventory): SO_Rpg_Item[] => {
  const inventory_id = typeof inventory === "string" ? inventory : inventory.id;
  return state.data[MO_Rpg_Item.class_name].filter((rpg_item: SO_Rpg_Item) => rpg_item.parent_id === inventory_id);
};

export let inventory_remove_rpg_item = (state: Backend_State, rpg_item_id: string, _clear_parent_id_list_gaps: boolean, _inventory_id?: string | SO_Inventory): void => {
  const inventory_id: string | undefined = typeof _inventory_id === "string" ? _inventory_id : _inventory_id?.id;
  const rpg_item_index = state.data[MO_Rpg_Item.class_name].findIndex((rpg_item: SO_Rpg_Item) => rpg_item.id === rpg_item_id && (!inventory_id || rpg_item.parent_id === inventory_id));

  if (rpg_item_index !== -1) {
    let rpg_item: SO_Rpg_Item = state.data[MO_Rpg_Item.class_name][rpg_item_index];

    let message: Pre_Message_Action_Send = {
      object_class: "Rpg_Item",
      function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
      id: rpg_item.id,
    };
    delete_object_and_relations(message, state);

    if (_clear_parent_id_list_gaps) {
      clear_parent_id_list_gaps(state, GLOBAL_CLASS_MAP[MO_Rpg_Item.class_name], rpg_item);
    }
  }
};

export let inventory_add_rpg_item = (state: Backend_State, inventory_id: string, rpg_item_id: string) => {
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

export let inventory_get_unused_rpg_item_index = (state: Backend_State, inventory_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  return inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
};

export let inventory_replace_rpg_item = (state: Backend_State, inventory_id: string, rpg_item_id: string) => {
  let inventory: SO_Inventory = inventory_get(state, inventory_id);
  let rpg_item_index = inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
  inventory.rpg_item_ids.ids[rpg_item_index] = rpg_item_id;
};
