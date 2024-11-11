import { fantasy_words } from "./FantasyWords";
import { getCurrentDate } from "../Utils/utils";

// Define a type for the Note structure
export type Note = {
  id: string;
  object_name: string;
  parent: string;
  child_list: string;
  property_list: string;
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

export const getBeeNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Bee",
    parent: "Bee_Hive",
    child_list: ``,
    property_list: `name`,
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
    property_list: `name`,
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
    property_list: `name`,
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
    property_list: `name`,
    date: getCurrentDate(),
  };
};

export const getPlayerNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Player",
    parent: "Player_Party",
    child_list: ``,
    property_list: `name
gold
current_experience
maximum_experience
current_health
maximum_health
minimum_damage
maximum_damage
fire_resistance
water_resistance
lightning_resistance
melee_heal_on_hit_flat
melee_heal_on_hit_percent`,
    date: getCurrentDate(),
  };
};

export const getInventoryNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Inventory",
    parent: "Player",
    child_list: `Item`,
    property_list: `name
description
type
image_path`,
    date: getCurrentDate(),
  };
};

export const getItemNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: "Item",
    parent: "Inventory",
    child_list: ``,
    property_list: `name
description
type
image_path
flag_quest_item
flag_cursed`,
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
    property_list: `${getRandomWord()}
${getRandomWord()}
${getRandomWord()}
${getRandomWord()}
${getRandomWord()}
${getRandomWord()}
${getRandomWord()}`,
    date: getCurrentDate(),
  };
};
