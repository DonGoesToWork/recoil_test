import { generate_unique_id, get_current_date } from "../Utils/utils";

import { fantasy_words } from "./FantasyWords";

export type Schema_Property = {
  name: string;
  default_value: string;
  type: string;
  do_gen_ia_set: boolean;
  do_gen_ia_get: boolean;
};

export type Sub_Schema = {
  name: string;
  id_list_start_size: number;
  id_list_max_size: number;
  id_list_allow_empty_indexes: boolean;
};

export type User_Interaction = {
  function_name: string;
  object_1: string;
  object_2: string;
};

// Define a type for the Schema structure
export type Schema = {
  id: string;
  object_name: string;
  parent_object_names_list: string[]; // gets set by fix_schema
  club_object_names_list: string[]; // gets set by fix_schema
  member_object_names_list: Sub_Schema[];
  do_gen_ia_create_new: boolean;
  child_schema_arr: Sub_Schema[];
  property_list: Schema_Property[];
  user_interaction_list: User_Interaction[];
  date: string;
};

function get_random_word() {
  const randomIndex = Math.floor(Math.random() * fantasy_words.length);
  return fantasy_words[randomIndex];
}

export const get_default_user_interaction = (): User_Interaction => {
  return {
    function_name: ``,
    object_1: ``,
    object_2: ``,
  };
};

export const get_default_sub_schema = (_name: string): Sub_Schema => {
  return {
    name: _name,
    id_list_start_size: 0,
    id_list_max_size: 0,
    id_list_allow_empty_indexes: false,
  };
};

export const get_default_string_property = (_name: string): Schema_Property => {
  return {
    name: _name,
    default_value: "undefined",
    type: "string",
    do_gen_ia_set: true,
    do_gen_ia_get: true,
  };
};

export const get_default_string_property_blank = (): Schema_Property => {
  return {
    name: "",
    default_value: "",
    type: "string",
    do_gen_ia_set: true,
    do_gen_ia_get: true,
  };
};

export const get_default_number_property = (_name: string): Schema_Property => {
  return {
    name: _name,
    default_value: "0",
    type: "number",
    do_gen_ia_set: true,
    do_gen_ia_get: true,
  };
};

export const get_bee_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Bee",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [],
    property_list: [get_default_string_property("Name")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_bee_hive_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Bee_Hive",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [get_default_sub_schema(`Bee`)],
    property_list: [get_default_string_property("Name")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_bee_farm_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Bee_Farm",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [get_default_sub_schema(`Bee_Hive`)],
    property_list: [get_default_string_property("Name")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_farmer_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Farmer",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [get_default_sub_schema(`Bee_Farm`)],
    property_list: [get_default_string_property("Name")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_nature_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Nature",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [get_default_sub_schema(`Bee_Farm`)],
    property_list: [get_default_string_property("Name")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_guild_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Guild",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [get_default_sub_schema("Player"), get_default_sub_schema("Inventory")],
    do_gen_ia_create_new: true,
    child_schema_arr: [],
    property_list: [get_default_string_property("Name"), get_default_number_property("treasury")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_party_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Party",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [get_default_sub_schema("Player")],
    do_gen_ia_create_new: true,
    child_schema_arr: [],
    property_list: [get_default_string_property("Name"), get_default_number_property("treasury")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_player_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Player",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [get_default_sub_schema(`Inventory`)],
    property_list: [
      get_default_string_property("Name"),
      get_default_number_property("Gold"),
      get_default_number_property("Current_Experience"),
      get_default_number_property("Maximum_Experience"),
      get_default_number_property("Current_Health"),
      get_default_number_property("Maximum_Health"),
      get_default_number_property("Minimum_Damage"),
      get_default_number_property("Maximum_Damage"),
      get_default_number_property("Fire_Resistance"),
      get_default_number_property("Water_Resistance"),
      get_default_number_property("Lightning_Resistance"),
      get_default_number_property("Melee_Heal_On_Hit_Flat"),
      get_default_number_property("Melee_Heal_On_Hit_Percent"),
    ],
    user_interaction_list: [
      {
        function_name: "attack_target",
        object_1: "Player",
        object_2: "Entity",
      },
    ],
    date: get_current_date(),
  };
};

export const get_entity_inventory_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Entity_Inventory",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [get_default_sub_schema("Inventory")],
    do_gen_ia_create_new: true,
    child_schema_arr: [],
    property_list: [get_default_string_property("Name")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_player_inventory_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Player_Inventory",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [get_default_sub_schema("Inventory")],
    do_gen_ia_create_new: true,
    child_schema_arr: [],
    property_list: [get_default_string_property("Name")],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_inventory_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Inventory",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [get_default_sub_schema(`Rpg_Item`)],
    property_list: [
      get_default_string_property("Name"),
      get_default_string_property("Description"),
      get_default_string_property("Type"),
      get_default_string_property("Image_Path"),
    ],
    user_interaction_list: [
      {
        function_name: "add_rpg_item",
        object_1: "inventory",
        object_2: "rpg_item",
      },
      {
        function_name: "remove_rpg_item",
        object_1: "inventory",
        object_2: "rpg_item",
      },
    ],
    date: get_current_date(),
  };
};

export const get_item_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Rpg_Item",
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [],
    property_list: [
      get_default_string_property("Name"),
      get_default_string_property("Description"),
      get_default_string_property("Type"),
      get_default_string_property("Image_Path"),
      get_default_string_property("Flag_Quest_Item"),
      get_default_string_property("Flag_Cursed"),
    ],
    user_interaction_list: [],
    date: get_current_date(),
  };
};

export const get_default_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: get_random_word(),
    parent_object_names_list: [],
    club_object_names_list: [],
    member_object_names_list: [],
    do_gen_ia_create_new: true,
    child_schema_arr: [get_default_sub_schema(get_random_word()), get_default_sub_schema(get_random_word()), get_default_sub_schema(get_random_word())],
    property_list: [
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
    ],
    user_interaction_list: [],
    date: get_current_date(),
  };
};
