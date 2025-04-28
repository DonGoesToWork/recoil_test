TODO:

1. Test a quad-nested structure and also multi-child per object additions.
2. Auto-generate files from schema and place into relevant locations.

Notes:

// show_events() {

// }

// do_harvest_event() {
// let event = rollEvent();

// if (event === 'face') {
// // change veiw
// set_player_view(View.Harvest);

// // generate 3 event cards.
// let eventCards = [ getRandomEventCard(), getRandomEventCard(), getRandomEventCard() ];
// state['eventcards'].push(...eventCards); (store actual copies)

// player_set_event_cards(eventcards); (set ids)
// }
// }

// do_harvest_click() {
// player.do_harvest_event();
// }

// do_event_card_click(id: nubmer (in the pyalod)) {
// let card = state['eventcards'].find((eventcard) => eventcard.id === id);
// card.process();
//

Sample Interaction

<!--
let change_multiple_hive_names_to_ted = (state: Backend_State, bee_hive_ids: string[]): void => {
  // todo implement
  return;
};
// Sample contents:

// For every bee hive in state at bee_hive_id, change property_l1_name to property_value.
// bee_hive_ids.forEach((bee_hive_id: string) => {
//     set_bee_hive_name_direct(state, bee_hive_id, "Ted");
//   });
ff
-->

Sample Inventory Item Operations

<!--
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


-->
