import { I_Data, get_data_base } from "../Backend_State/Shared_State_Types";
import { Message_Recieve, Payload_Add, Payload_Delete, Payload_Set } from "../z_generated/Shared_Misc/Communication_Interfaces";
import { SO_Object, Sub_Schema } from "../z_generated/Shared_Misc/Sub_Schema";

import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";
import { generate_unique_id } from "../utils/utils";

// In-memory storage for simplicity; replace with a database in production
class Shared_State {
  protected data: I_Data = get_data_base(); // todo, upgrade to private later on

  /**
   * Logic for interacting with data on the backend.
   */

  get_data(): I_Data {
    return this.data;
  }

  get_data_record(class_name: keyof I_Data): Record<string, SO_Object> {
    return this.data[class_name];
  }

  protected set_data_record<K extends keyof I_Data>(class_name: K, record: I_Data[K]): void {
    this.data[class_name] = record;
  }

  get_data_entries(): { [K in keyof I_Data]: [K, I_Data[K]] }[keyof I_Data][] {
    return Object.entries(this.data) as { [K in keyof I_Data]: [K, I_Data[K]] }[keyof I_Data][];
  }

  protected set_data_entries(entries: { [K in keyof I_Data]: [K, I_Data[K]] }[keyof I_Data][]): void {
    const reconstructedData = Object.fromEntries(entries) as I_Data;

    // Basic validation (optional but recommended if using this method)
    if (!reconstructedData.farmer || !reconstructedData.inventory || Object.keys(reconstructedData).length !== 2) {
      console.error("set_data_entries received invalid data structure. Aborting update.", entries);
      return;
    }

    this.data = reconstructedData;
  }

  get_object<K extends keyof I_Data>(class_name: K, object_id: string): I_Data[K][string] | undefined {
    const record = this.data[class_name];
    return record[object_id] as I_Data[K][string] | undefined;
  }

  protected set_object<K extends keyof I_Data>(class_name: K, object_id: string, object: I_Data[K][string]): void {
    this.data[class_name][object_id] = object;
  }

  /**
   * Interactions with sub-objects
   */

  get_parents<K extends keyof I_Data>(class_name: K, object_id: string): SO_Object[] {
    // Get base object using class_name and object_id.
    let object = this.get_object(class_name, object_id);

    if (object === undefined || !object.parent_id_data) {
      return [];
    }

    // get parent id data
    let parent_id_data: [string, string[]][] = Object.entries(object.parent_id_data);
    let parent_objects: SO_Object[] = [];

    // loop through parent id data
    for (let [parent_class_name, parent_ids] of parent_id_data) {
      // loop through parent ids
      for (let parent_id of parent_ids) {
        // get parent object
        let parent_object = this.get_object(parent_class_name as keyof I_Data, parent_id);
        if (parent_object !== undefined) {
          parent_objects.push(parent_object);
        }
      }
    }

    return parent_objects;
  }

  get_clubs<K extends keyof I_Data>(class_name: K, object_id: string): SO_Object[] {
    let object = this.get_object(class_name, object_id);

    if (object === undefined || !object.parent_id_data) {
      return [];
    }

    let club_id_data: [string, string[]][] = Object.entries(object.parent_id_data);
    let club_objects: SO_Object[] = [];

    for (let [club_class_name, club_ids] of club_id_data) {
      for (let club_id of club_ids) {
        let club_object = this.get_object(club_class_name as keyof I_Data, club_id);
        if (club_object !== undefined) {
          club_objects.push(club_object);
        }
      }
    }

    return club_objects;
  }

  get_children<K extends keyof I_Data>(class_name: K, object_id: string): SO_Object[] {
    let object = this.get_object(class_name, object_id);

    if (object === undefined || !object.child_id_data) {
      return [];
    }

    let children_id_data: [string, Sub_Schema][] = Object.entries(object.child_id_data);
    let children_objects: SO_Object[] = [];

    for (let [child_class_name, child_ids] of children_id_data) {
      for (let child_id of child_ids.ids) {
        let child_object = this.get_object(child_class_name as keyof I_Data, child_id);
        if (child_object !== undefined) {
          children_objects.push(child_object);
        }
      }
    }

    return children_objects;
  }

  get_members(class_name: string, object_id: string): SO_Object[] {
    let object = this.get_object(class_name as keyof I_Data, object_id);

    if (object === undefined || !object.member_id_data) {
      return [];
    }

    let member_id_data: [string, Sub_Schema][] = Object.entries(object.member_id_data);
    let member_objects: SO_Object[] = [];

    for (let [member_class_name, member_ids] of member_id_data) {
      for (let member_id of member_ids.ids) {
        let member_object = this.get_object(member_class_name as keyof I_Data, member_id);
        if (member_object !== undefined) {
          member_objects.push(member_object);
        }
      }
    }

    return member_objects;
  }

  /**
   * Logic managing payloads to send data back to front-end.
   */

  public server_state_ref: string = generate_unique_id();
  public change_payloads: Message_Recieve[] = [];

  public randomize_server_state_ref(): void {
    this.server_state_ref = generate_unique_id();
  }

  set(payload: Payload_Set) {
    let object_type = payload.object_type as keyof I_Data;

    // validity check
    if (GLOBAL_CLASS_MAP[object_type] === undefined) {
      console.log("Fatal error: Tried to add object of unsupported type: " + object_type);
      return;
    }

    let object_list = this.data[object_type];

    // validity check
    if (object_list === null || object_list === undefined) {
      console.log("Fatal error: Object type " + object_type + " not found.");
      return;
    }

    const target_object = object_list[payload.id];

    // validity checks
    if (!target_object) {
      console.log("Fatal error: Object type " + object_type + " not found.");
      return;
    }

    if (!target_object[payload.property_name]) {
      console.log("Fatal error: Property " + payload.property_name + " not found.");
      return;
    }

    // Change internal state
    target_object[payload.property_name] = payload.property_value;

    // Create payload to send to front-end.
    let message: Message_Recieve;

    message = {
      messageType: "set",
      payload,
    };

    this.change_payloads.push(message);
  }

  add(payload: Payload_Add) {
    let object_type = payload.object_type;

    // validity check
    if (GLOBAL_CLASS_MAP[object_type] === undefined) {
      console.log("Fatal error: Tried to add object of unsupported type: " + object_type);
      return;
    }

    let object_id = payload.object_id;

    if (!payload.object_id) {
      console.log("Fatal error: Can't add object with no id: ", object_type, payload);
      return;
    }

    // If first entry, prepare array.
    if (!this.data[object_type]) {
      this.data[object_type] = {};
    }

    this.data[object_type][payload.object_id] = payload.object;

    // Create payload to send to front-end.
    let message: Message_Recieve;

    message = {
      messageType: "add",
      payload,
    };

    this.change_payloads.push(message);
  }

  delete(payload: Payload_Delete) {
    let object_type = payload.object_type as keyof I_Data; // temporarily make type I_Data, because it will be checked next!

    // Sanity check.
    if (this.data[object_type] === undefined) {
      console.log("Fatal error: Tried to delete non-existant object: " + object_type);
      return;
    }

    // Filter object out of data.
    this.data[object_type] = Object.fromEntries(Object.entries(this.data[object_type]).filter(([key]) => key !== payload.objectId));

    // Create payload to send to front-end.
    let message: Message_Recieve;

    message = {
      messageType: "delete",
      payload,
    };

    this.change_payloads.push(message);
  }

  get_full_storage(): Message_Recieve[] {
    let message: Message_Recieve;

    for (const key of Object.keys(this.data) as (keyof I_Data)[]) {
      for (const key2 of Object.keys(this.data[key])) {
        message = {
          messageType: "add",
          payload: {
            object_id: key2,
            object_type: key,
            object: this.data[key][key2],
          },
        };

        this.change_payloads.push(message);
      }
    }

    return this.change_payloads;
  }

  clearChanges(): void {
    this.change_payloads = [];
  }
}

export default Shared_State;

// message = {
//   messageType: "add",
//   payload: {
//     object_type: key,
//     object: value,
//   },
// };
// this.change_payloads.push(message);

// Explanation of the return type:
// 1. { [K in keyof I_Data]: [K, I_Data[K]] }
//    This is a Mapped Type. It iterates through each key K in I_Data ("farmer", "inventory").
//    For each K, it creates a property in a temporary mapped object type:
//    - K: The literal key type (e.g., "farmer")
//    - [K, I_Data[K]]: A tuple type where the first element is the literal key K,
//                     and the second element is the type of the value associated with K in I_Data.
//    So, this part resolves to an object type like:
//    {
//      farmer: ["farmer", Record<string, SO_Farmer>];
//      inventory: ["inventory", Record<string, SO_Inventory>];
//    }
//
// 2. {...}[keyof I_Data]
//    This is an Indexed Access Type. It looks up all the property *values* from the mapped object type created in step 1,
//    using all possible keys (keyof I_Data).
//    This effectively creates a *union* of all the value types (the tuples):
//    ["farmer", Record<string, SO_Farmer>] | ["inventory", Record<string, SO_Inventory>]
//
// 3. (... )[]
//    This wraps the resulting union of tuples in an array, indicating that the function
//    returns an array where *each element* must conform to that union type.

// Object.entries itself is often typed less precisely by default TS lib (e.g., [string, V][]),
// so we use a type assertion ('as') to tell TypeScript we know the more specific structure.
