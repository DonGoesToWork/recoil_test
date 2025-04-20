import { Message_Receive, Payload_Add, Payload_Delete, Payload_Set } from "../z_generated/Shared_Misc/Communication_Interfaces";

import { App_State } from "../z_generated/App_State/App_State";
import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";
import { generate_unique_id } from "../utils/utils";

// In-memory storage for simplicity; replace with a database in production
class Shared_State {
  /**
   * Logic managing payloads to send data back to front-end.
   */

  public server_state_ref: string = generate_unique_id();
  public change_payloads: Message_Receive[] = [];

  public randomize_server_state_ref(): void {
    this.server_state_ref = generate_unique_id();
  }

  set(app_state: App_State, payload: Payload_Set) {
    // ensure payload object type is a member of app state.
    if (!(payload.object_type in app_state)) {
      console.log("Fatal error: Payload object type is not a member of app state.");
      return;
    }

    switch (payload.object_type) {
      case "Inventory":
        app_state.inventory.get_object(payload.id)?.[payload.property_name] = payload.property_value;

        /**
         * 
        let obj = app_state.inventory.get_object(payload.id);
        obj[payload.property_name] = payload.property_value;

        
        break;
        if (obj === undefined) {
          console.log("Fatal error: Object type " + payload.object_type + " not found.");
          return;
        }
        obj[payload.property_name] = payload.property_value;
         */
        break;
    }

    // Create payload to send to front-end.
    let message: Message_Receive;

    message = {
      messageType: "set",
      payload,
    };

    this.change_payloads.push(message);

    // let object_list = this.data[object_type];

    // // validity check
    // if (object_list === null || object_list === undefined) {
    //   console.log("Fatal error: Object type " + object_type + " not found.");
    //   return;
    // }

    // const target_object = object_list[payload.id];

    // // validity checks
    // if (!target_object) {
    //   console.log("Fatal error: Object type " + object_type + " not found.");
    //   return;
    // }

    // if (!target_object[payload.property_name]) {
    //   console.log("Fatal error: Property " + payload.property_name + " not found.");
    //   return;
    // }

    // // Change internal state
    // target_object[payload.property_name] = payload.property_value;

    // // Create payload to send to front-end.
    // let message: Message_Receive;

    // message = {
    //   messageType: "set",
    //   payload,
    // };

    // this.change_payloads.push(message);
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
    let message: Message_Receive;

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
    let message: Message_Receive;

    message = {
      messageType: "delete",
      payload,
    };

    this.change_payloads.push(message);
  }

  get_full_storage(): Message_Receive[] {
    let message: Message_Receive;

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
