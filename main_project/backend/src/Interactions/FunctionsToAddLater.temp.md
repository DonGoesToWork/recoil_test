// Parent functions

// Todo: I don't think this function even works right either.

export let inventory_get_parent = (state: Backend_State, inventory_id: string) => {
let inventory = inventory_get(state, inventory_id);
let parent_class_name = inventory.parent_class_name;

MO_Inventory.parent_data?.class_names.forEach((parent_class_name: string) => {

});
let parents = [""]; // can generate this list

return state.data["inventory"].find((inventory: SO_Inventory) => inventory.id === inventory_id)?.parent_id;
};

// Don't need remove/add for parents because they are set on creation and can never change.

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

export let inventory_add_player_inventory = (state: Backend_State, player_inventory_id: string): void => {
let player_inventory: SO_Player_Inventory = player_inventory_get(state, player_inventory_id);

if (!player_inventory) {
return;
}

player*inventory_add*
};
