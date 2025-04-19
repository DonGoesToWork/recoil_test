import { Message_Receive, Payload_Add, Payload_Delete, Payload_Set } from "../z_generated/Shared_Misc/Communication_Interfaces";

import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";
import Shared_State from "./Shared_State";
import { generate_unique_id } from "../utils/utils";

// In-memory storage for simplicity; replace with a database in production
export class Backend_State extends Shared_State {
  public server_state_ref: string = generate_unique_id();
  public change_payloads: Message_Receive[] = [];

  public randomize_server_state_ref(): void {
    this.server_state_ref = generate_unique_id();
  }

  set(payload: Payload_Set) {
    let object_type = payload.object_type;
    const target_object = this.get_object(object_type, payload.id);

    // Sanity checks.
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
    let message: Message_Receive;

    message = {
      messageType: "set",
      payload,
    };

    this.change_payloads.push(message);
  }

  add(payload: Payload_Add) {
    let object_type = payload.object_type;

    // Sanity check.
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
    if (!this.get_data_record(object_type)) {
      this.set_data_record(object_type, {});
    }

    this.set_object(object_type, object_id, payload.object);

    // Create payload to send to front-end.
    let message: Message_Receive;

    message = {
      messageType: "add",
      payload,
    };

    this.change_payloads.push(message);
  }

  delete(payload: Payload_Delete) {
    let object_type = payload.object_type;

    // Sanity check.
    if (!this.get_data_record(object_type)) {
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

    for (const key of Object.keys(this.data)) {
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

// Old backup

// /**
//  * Logic managing payloads to send data back to front-end.
//  */

// public server_state_ref: string = generate_unique_id();
// public change_payloads: Message_Receive[] = [];

// public randomize_server_state_ref(): void {
//   this.server_state_ref = generate_unique_id();
// }

// set(payload: Payload_Set) {
//   let object_type = payload.object_type as keyof I_Data;

//   // validity check
//   if (GLOBAL_CLASS_MAP[object_type] === undefined) {
//     console.log("Fatal error: Tried to add object of unsupported type: " + object_type);
//     return;
//   }

//   let object_list = this.data[object_type];

//   // validity check
//   if (object_list === null || object_list === undefined) {
//     console.log("Fatal error: Object type " + object_type + " not found.");
//     return;
//   }

//   const target_object = object_list[payload.id];

//   // validity checks
//   if (!target_object) {
//     console.log("Fatal error: Object type " + object_type + " not found.");
//     return;
//   }

//   if (!target_object[payload.property_name]) {
//     console.log("Fatal error: Property " + payload.property_name + " not found.");
//     return;
//   }

//   // Change internal state
//   target_object[payload.property_name] = payload.property_value;

//   // Create payload to send to front-end.
//   let message: Message_Receive;

//   message = {
//     messageType: "set",
//     payload,
//   };

//   this.change_payloads.push(message);
// }

// add(payload: Payload_Add) {
//   let object_type = payload.object_type;

//   // validity check
//   if (GLOBAL_CLASS_MAP[object_type] === undefined) {
//     console.log("Fatal error: Tried to add object of unsupported type: " + object_type);
//     return;
//   }

//   let object_id = payload.object_id;

//   if (!payload.object_id) {
//     console.log("Fatal error: Can't add object with no id: ", object_type, payload);
//     return;
//   }

//   // If first entry, prepare array.
//   if (!this.data[object_type]) {
//     this.data[object_type] = {};
//   }

//   this.data[object_type][payload.object_id] = payload.object;

//   // Create payload to send to front-end.
//   let message: Message_Receive;

//   message = {
//     messageType: "add",
//     payload,
//   };

//   this.change_payloads.push(message);
// }

// delete(payload: Payload_Delete) {
//   let object_type = payload.object_type as keyof I_Data; // temporarily make type I_Data, because it will be checked next!

//   // Sanity check.
//   if (this.data[object_type] === undefined) {
//     console.log("Fatal error: Tried to delete non-existant object: " + object_type);
//     return;
//   }

//   // Filter object out of data.
//   this.data[object_type] = Object.fromEntries(Object.entries(this.data[object_type]).filter(([key]) => key !== payload.objectId));

//   // Create payload to send to front-end.
//   let message: Message_Receive;

//   message = {
//     messageType: "delete",
//     payload,
//   };

//   this.change_payloads.push(message);
// }

// get_full_storage(): Message_Receive[] {
//   let message: Message_Receive;

//   for (const key of Object.keys(this.data) as (keyof I_Data)[]) {
//     for (const key2 of Object.keys(this.data[key])) {
//       message = {
//         messageType: "add",
//         payload: {
//           object_id: key2,
//           object_type: key,
//           object: this.data[key][key2],
//         },
//       };

//       this.change_payloads.push(message);
//     }
//   }

//   return this.change_payloads;
// }

// clearChanges(): void {
//   this.change_payloads = [];
// }
