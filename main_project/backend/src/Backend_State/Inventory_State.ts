import { MO_Guild, SO_Guild } from "../z_generated/Shared_Data_Models/Guild";
import { MO_Inventory_Accessory, SO_Inventory_Accessory } from "../z_generated/Shared_Data_Models/Inventory_Accessory";
import { MO_Player, SO_Player } from "../z_generated/Shared_Data_Models/Player";
import { MO_Rpg_Item, SO_Rpg_Item } from "../z_generated/Shared_Data_Models/Rpg_Item";

import { All_State } from "./All_State";
import { SO_Inventory } from "../z_generated/Shared_Data_Models/Inventory";

export class Inventory_State {
  protected data: Record<string, SO_Inventory> = {};

  // * Logic for interacting with data on the backend.

  get_data(): Record<string, SO_Inventory> {
    return this.data;
  }

  protected set_record(id: string, inventory: SO_Inventory): void {
    this.data[id] = inventory;
  }

  get_entries(): [string, SO_Inventory][] {
    return Object.entries(this.data);
  }

  protected set_data_entries(entries: [string, SO_Inventory][]): void {
    this.data = Object.fromEntries(entries);
  }

  get_object(object_id: string): SO_Inventory | undefined {
    return this.data[object_id];
  }

  protected set_object(object_id: string, object: SO_Inventory): void {
    this.data[object_id] = object;
  }

  // * Interactions with sub-objects

  get_parent_player(all_state: All_State, object_id: string): SO_Player[] {
    const object = this.get_object(object_id);
    return object?.parent_id_data?.player
      ? object.parent_id_data.player.map((player_id: string) =>
          all_state.get_object(MO_Player.class_name, player_id)
        )
      : [];
  }
  get_club_guild(all_state: All_State, object_id: string): SO_Guild[] {
    const object = this.get_object(object_id);
    return object?.club_id_data?.guild
      ? object.club_id_data.guild.map((guild_id: string) =>
          all_state.get_object(MO_Guild.class_name, guild_id)
        )
      : [];
  }

  get_children_rpg_item(all_state: All_State, object_id: string): SO_Rpg_Item[] {
    const object = this.get_object(object_id);
    return object?.child_id_data?.rpg_item?.ids
      ? object.child_id_data.rpg_item.ids.map((rpg_item_id: string) =>
          all_state.get_object(MO_Rpg_Item.class_name, rpg_item_id)
        )
      : [];
  }

  get_members_inventory_accessory(all_state: All_State, object_id: string): SO_Inventory_Accessory[] {
    const object = this.get_object(object_id);
    return object?.member_id_data?.inventory_accessory?.ids
      ? object.member_id_data.inventory_accessory.ids.map((inventory_accessory_id: string) =>
          all_state.get_object(MO_Inventory_Accessory.class_name, inventory_accessory_id)
        )
      : [];
  }
}
