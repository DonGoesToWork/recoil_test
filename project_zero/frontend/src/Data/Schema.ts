import { generate_unique_id, get_current_date } from "../Utils/utils";

import { fantasy_words } from "./FantasyWords";

export type Schema_Property = {
  name: string;
  default_value: string;
  type: string;
  do_gen_ia_create_new: boolean;
  do_gen_ia_set: boolean;
};

// Define a type for the Schema structure
export type Schema = {
  id: string;
  object_name: string;
  parent: string;
  child_list: string;
  property_list: Schema_Property[];
  date: string; // Add a date field
};

function get_random_word() {
  const randomIndex = Math.floor(Math.random() * fantasy_words.length);
  return fantasy_words[randomIndex];
}

const get_default_string_property = (_name: string): Schema_Property => {
  return {
    name: _name,
    default_value: "None",
    type: "string",
    do_gen_ia_create_new: true,
    do_gen_ia_set: true,
  };
};

const get_default_number_property = (_name: string): Schema_Property => {
  return {
    name: _name,
    default_value: "None",
    type: "number",
    do_gen_ia_create_new: true,
    do_gen_ia_set: true,
  };
};

export const get_bee_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Bee",
    parent: "Bee_Hive",
    child_list: ``,
    property_list: [get_default_string_property("Name")],
    date: get_current_date(),
  };
};

export const get_bee_hive_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Bee_Hive",
    parent: "Bee_Farm",
    child_list: `Bee`,
    property_list: [get_default_string_property("Name")],
    date: get_current_date(),
  };
};

export const get_bee_farm_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Bee_Farm",
    parent: "Farmer",
    child_list: `Bee_Hive`,
    property_list: [get_default_string_property("Name")],
    date: get_current_date(),
  };
};

export const get_farmer_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Farmer",
    parent: "",
    child_list: `Bee_Farm`,
    property_list: [get_default_string_property("Name")],
    date: get_current_date(),
  };
};

export const get_player_object = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Player",
    parent: "Player_Party",
    child_list: `Inventory`,
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
    date: get_current_date(),
  };
};

export const get_inventory_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Inventory",
    parent: "Player",
    child_list: `Rpg_Item`,
    property_list: [get_default_string_property("Name"), get_default_string_property("Description"), get_default_string_property("Type"), get_default_string_property("Image_Path")],
    date: get_current_date(),
  };
};

export const get_item_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: "Rpg_Item",
    parent: "Inventory",
    child_list: ``,
    property_list: [get_default_string_property("Name"), get_default_string_property("Description"), get_default_string_property("Type"), get_default_string_property("Image_Path"), get_default_string_property("Flag_Quest_Item"), get_default_string_property("Flag_Cursed")],
    date: get_current_date(),
  };
};

export const get_default_schema = (id?: string): Schema => {
  let finalId = id === undefined ? generate_unique_id() : id;

  return {
    id: finalId,
    object_name: get_random_word(),
    parent: get_random_word(),
    child_list: `${get_random_word()}
${get_random_word()}
${get_random_word()}`,
    property_list: [
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
      get_default_string_property(get_random_word()),
    ],
    date: get_current_date(),
  };
};
