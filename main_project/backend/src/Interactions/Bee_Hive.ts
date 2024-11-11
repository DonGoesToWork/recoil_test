import Backend_State from "../static_internal_logic/Backend_State";

// IO_Bee_Hive Interface Placed Here For Convenience:

// interface IO_Bee_Hive {
//   name: string;
//   name_user_input: string;
//   id: string;
//   bee_ids: string[];
//   parent_id: string;
// }

let sample_interaction = (state: Backend_State, bee_hive_ids: string[]): void => {
  return;
};


interface Inventory {
  item_ids: string[];
  max_size: number;
}

let add_inventory_item = (state: Backend_State, inventory_id: string) => {
  if (inventory_is_full(state, inventory_id)) {
    return;
  }

  create_new_item(state, ...other args, inventory_id); // state, args, parent_id
}

// For each child, we can generate:
// - object_child_get_all() method
// - object_child_get_(id) method
// - object_child_remove_(id) method (call our generic remove method)

    // For child objects that are 'constrained arrays', we can auto-generate a variety of fields:
    // - child_max_size field
    // - objecT_child_is_full() method



// Generate this (Add max-size constraint field automatically to object to configure max size UI?)

let inventory_is_full = (state: Backend_State, inventory_id: string)=> {
  let inventory = get_inventory(state, inventory_id);
  return (inventory.length >= 10);
}

// Generate this (Add max-size constraint to array fields to configure in UI?)

let inventory_get_free_spot = (state: Backend_State, inventory_id: string)=> {
  let inventory_item_ids_arr = state["inventory"].item_ids;

  return (inventory.length >= 10);
}

// Generate this

let get_items = (state: Backend_State, inventory_id: string) => {
  return state["inventory"].item_ids;
}

