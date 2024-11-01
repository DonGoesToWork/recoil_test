import { getCurrentDate } from "../Utils/utils";

// Define a type for the Note structure
export type Note = {
  id: string;
  object_name: string;
  parent: string;
  child_list: string;
  user_property_list: string;
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

let fantasy_words = [
  "Wizard",
  "Fireball",
  "Conjure_Stone_Elemental",
  "Inn",
  "Dungeon",
  "Raid",
  "Boss",
  "Alchemy",
  "Arcane_Orb",
  "Shadow_Blade",
  "Dragon_Kin",
  "Mystic_Circle",
  "Phoenix_Feather",
  "Elven_Bow",
  "Crystal_Shard",
  "Moonlight_Spell",
  "Necromancer",
  "Scroll_of_Whispers",
  "Battle_Axe",
  "Sorceress",
  "Thunderstrike",
  "Potion_of_Healing",
  "Dark_Forest",
  "Rogue",
  "Golden_Amulet",
  "Skyship",
  "Warlock",
  "Frost_Breath",
  "Hallowed_Sanctum",
  "Spectral_Wolf",
  "Ancient_Ruins",
  "Cursed_Tomb",
  "Silver_Sword",
  "Glimmering_Rune",
  "Fire_Sprite",
  "Dwarven_Forge",
  "Celestial_Tome",
  "Blood_Mage",
  "Stormcaller",
  "Rift_Walker",
  "Nightmare_Mount",
  "Forbidden_Grimoire",
  "Shimmering_Cloak",
  "Ironclad_Golem",
  "Soul_Binder",
  "Mages_Guild",
  "Kingdom_of_Aurenth",
  "Goblin_Warrior",
  "Crown_of_Embers",
  "Tavern",
  "Runeblade",
  "Sanctuary",
  "Wyrm",
  "Portal_Stone",
  "Shadow_Realm",
  "Fire_Drake",
  "Sorcery",
  "Sun_Temple",
  "Bloodmoon",
  "Griffin_Rider",
  "Mana_Well",
  "Elderwood",
  "Ice_Lance",
  "Spectral_Realm",
  "Demon_Hunter",
  "Forgotten_Legends",
  "Moonstone",
  "Caverns_of_Doom",
  "Spirit_Warden",
  "Etherial_Bridge",
  "Royal_Guard",
  "Feywild",
  "Arcane_Sigil",
  "Enchanted_Shield",
  "Sword_of_Fury",
  "Wyrmling",
  "Crystal_Caves",
  "Darkflame",
  "Wind_Shear",
  "Frostbite_Citadel",
  "Void_Walker",
  "Necrotic_Energy",
  "Celestial_Bridge",
  "Scorched_Sands",
  "Royal_Armory",
  "Chronomancer",
  "Astral_Gateway",
  "Nether_Realm",
  "Riftblade",
  "Lightning_Surge",
  "Drakescale_Armor",
  "Void_Crystal",
  "Spectral_Lantern",
  "Ashen_Lands",
  "Hallowed_Knight",
  "Whispering_Woods",
  "Feral_Werewolf",
  "Shattered_Realm",
  "Tidal_Wave",
  "Mithril_Shard",
  "Dragonborn",
  "Rune_of_Warding",
  "Ember_Bridge",
];

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
    user_property_list: "name",
    property_list: ``,
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
    user_property_list: "name",
    property_list: ``,
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
    user_property_list: "name",
    property_list: ``,
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
    user_property_list: "name",
    property_list: ``,
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
    user_property_list: "name",
    property_list: `gold
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

export const getDefaultNote = (id?: string): Note => {
  let finalId = id === undefined ? getUniqueId() : id;

  return {
    id: finalId,
    object_name: getRandomWord(),
    parent: getRandomWord(),
    child_list: `${getRandomWord()}
${getRandomWord()}
${getRandomWord()}`,
    user_property_list: getRandomWord(),
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
