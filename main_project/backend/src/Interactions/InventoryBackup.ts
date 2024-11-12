import { IO_Inventory, IS_Inventory } from "../z_generated/Shared_Data_Models/Inventory";

import Backend_State from "../static_internal_logic/Backend_State";
import { DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME } from "../utils/IA_Remove";
import { IO_Rpg_Item } from "../z_generated/Shared_Data_Models/Rpg_Item";
import { Pre_Message_Action_Send } from "../z_generated/Shared_Misc/Communication_Interfaces";
import { create_new_rpg_item } from "../z_generated/Data_Models/Rpg_Item";
import { delete_object_and_relations } from "../static_internal_logic/Generic_Remove";

// DAR TODO - Generate this file after adding more interaction/constraint support.

let inventory_add_rpg_item = (state: Backend_State, inventory_id: string) => {
  if (inventory_is_full(state, inventory_id)) {
    return;
  }

  let inventory_setup: IS_Inventory = {
    parent_id: inventory_id,
  };

  inventory_setup.name = "Rpg Item Name";
  inventory_setup.description = "Rpg Item Description";
  inventory_setup.type = "Rpg Item Type";
  inventory_setup.image_path = "Rpg Item Image Path";

  create_new_rpg_item(state, inventory_setup, () => {
    // placeholder - do nothing
  });
};

let inventory_get = (state: Backend_State, inventory_id: string): IO_Inventory => {
  return state.data["inventory"].find((inventory: IO_Inventory) => inventory.id === inventory_id);
};

let inventory_delete = (state: Backend_State, inventory_id: string) => {
  let msg: Pre_Message_Action_Send = {
    object_class: "inventory",
    function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
    id: inventory_id,
  };
  delete_object_and_relations(msg, state);
};

let inventory_get_free_rpg_item_index = (state: Backend_State, inventory_id: string) => {
  let inventory: IO_Inventory = inventory_get(state, inventory_id);
  return inventory.rpg_item_ids.ids.findIndex((rpg_item_id: string) => rpg_item_id === "");
};

// inventory methods: variable based on constrained vs. non-constained array.

// constrained:
let inventory_is_full = (state: Backend_State, inventory_id: string) => {
  let inventory: IO_Inventory = inventory_get(state, inventory_id);
  return inventory.rpg_item_ids.ids.length >= inventory.rpg_item_ids.max_size;
};

// child: rpg_item methods:

let inventory_get_rpg_item = (state: Backend_State, inventory: string | IO_Inventory, rpg_item: string | IO_Rpg_Item): IO_Rpg_Item | undefined => {
  const inventory_id = typeof inventory === "string" ? inventory : inventory.id;
  const rpg_item_id = typeof rpg_item === "string" ? rpg_item : rpg_item.id;
  return state.data["rpg_item"].find((rpg_item: IO_Rpg_Item) => rpg_item.parent_id === inventory_id)?.find((rpg_item: IO_Rpg_Item) => rpg_item.id === rpg_item_id);
};

let inventory_get_rpg_items = (state: Backend_State, inventory: string | IO_Inventory): IO_Rpg_Item[] => {
  const inventory_id = typeof inventory === "string" ? inventory : inventory.id;
  return state.data["rpg_item"].filter((rpg_item: IO_Rpg_Item) => rpg_item.parent_id === inventory_id);
};

let inventory_remove_item = (state: Backend_State, rpg_item_id: string, _inventory_id?: string | IO_Inventory): void => {
  const inventory_id: string | undefined = typeof _inventory_id === "string" ? _inventory_id : _inventory_id?.id;
  const rpg_item_index = state.data["rpg_item"].findIndex((rpg_item: IO_Rpg_Item) => rpg_item.id === rpg_item_id && (!inventory_id || rpg_item.parent_id === inventory_id));

  if (rpg_item_index !== -1) {
    // perform 'delete_[object_class]' method in-place.
    let msg: Pre_Message_Action_Send = {
      object_class: "Rpg_Item",
      function_name: DEFAULT_REMOVAL_MESSAGE_OBJECT_FUNCTION_NAME,
      id: state.data["rpg_item"][rpg_item_index].id,
    };
    delete_object_and_relations(msg, state);
  }
};
