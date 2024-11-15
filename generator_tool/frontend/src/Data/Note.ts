import { fantasy_words } from "./FantasyWords";
import { getCurrentDate } from "../Utils/utils";

export type Note_Property = {
  name: string;
  default_value: string;
  type: string;
  do_gen_ia_create_new: boolean;
  do_gen_ia_set: boolean;
};

// Define a type for the Note structure
export type Note = {
  id: string;
  object_name: string;
  parent: string;
  child_list: string;
  property_list: Note_Property[];
  date: string; // Add a date field
};

let curId: number = 0;

export const getUniqueId = (): string => {
  curId += 1;

  if (curId > Number.MAX_SAFE_INTEGER) {
    curId = 0;
    console.log("Wow, how did this program not crash yet?");
  }

  return curId.toString();
};

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * fantasy_words.length);
  return fantasy_words[randomIndex];
}

const get_default_string_property = (_name: string): Note_Property => {
  return {
    name: _name,
    default_value: "None",
    type: "string",
    do_gen_ia_create_new: true,
    do_gen_ia_set: true,
  };
};
const get_default_number_property = (_name: string): Note_Property => {
  return {
    name: _name,
    default_value: "None",
    type: "number",
    do_gen_ia_create_new: true,
    do_gen_ia_set: true,
  };
};

export const getBeeNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Bee",
    parent: "Bee_Hive",
    child_list: ``,
    property_list: [get_default_string_property("Name")],
    date: getCurrentDate(),
  };
};

export const getBeeHiveNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Bee_Hive",
    parent: "Bee_Farm",
    child_list: `Bee`,
    property_list: [get_default_string_property("Name")],
    date: getCurrentDate(),
  };
};

export const getBeeFarmNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Bee_Farm",
    parent: "Farmer",
    child_list: `Bee_Hive`,
    property_list: [get_default_string_property("Name")],
    date: getCurrentDate(),
  };
};

export const getFarmerNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Farmer",
    parent: "",
    child_list: `Bee_Farm`,
    property_list: [get_default_string_property("Name")],
    date: getCurrentDate(),
  };
};

export const getPlayerNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

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
    date: getCurrentDate(),
  };
};

export const getInventoryNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Inventory",
    parent: "Player",
    child_list: `Rpg_Item`,
    property_list: [get_default_string_property("Name"), get_default_string_property("Description"), get_default_string_property("Type"), get_default_string_property("Image_Path")],
    date: getCurrentDate(),
  };
};

export const getItemNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Rpg_Item",
    parent: "Inventory",
    child_list: ``,
    property_list: [get_default_string_property("Name"), get_default_string_property("Description"), get_default_string_property("Type"), get_default_string_property("Image_Path"), get_default_string_property("Flag_Quest_Item"), get_default_string_property("Flag_Cursed")],
    date: getCurrentDate(),
  };
};

export const getDefaultNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: getRandomWord(),
    parent: getRandomWord(),
    child_list: `${getRandomWord()}
${getRandomWord()}
${getRandomWord()}`,
    property_list: [
      get_default_string_property(getRandomWord()),
      get_default_string_property(getRandomWord()),
      get_default_string_property(getRandomWord()),
      get_default_string_property(getRandomWord()),
      get_default_string_property(getRandomWord()),
      get_default_string_property(getRandomWord()),
      get_default_string_property(getRandomWord()),
    ],
    date: getCurrentDate(),
  };
};
