import { I_Data, I_State_Record, SO_Object, Sub_Schema } from "./Backend_State_Types";
import { Message_Recieve, Payload_Add, Payload_Delete, Payload_Set } from "../z_generated/Shared_Misc/Communication_Interfaces";

import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";
import { generate_unique_id } from "../utils/utils";

// In-memory storage for simplicity; replace with a database in production
class Backend_State {
  private data: I_Data = {};

  /**
   * Logic for interacting with data on the backend.
   */

  get_data(): I_Data {
    return this.data;
  }

  get_data_entries(): [string, I_State_Record][] {
    return Object.entries(this.data);
  }

  get_object(class_name: string, object_id: string): SO_Object {
    return this.data[class_name][object_id];
  }

  get_parents(class_name: string, object_id: string): SO_Object[] {
    let object = this.get_object(class_name, object_id);

    if (!object.parent_id_data) {
      return [];
    }

    return Object.entries(object.parent_id_data).map(([parent_class_name, parent_id]) => this.get_object(parent_class_name, parent_id));
  }

  get_children(class_name: string, object_id: string): SO_Object[] {
    let object = this.get_object(class_name, object_id);

    if (!object.child_id_data) {
      return [];
    }

    return Object.entries(object.child_id_data).flatMap(([child_class_name, child_schema]: [string, Sub_Schema]) =>
      child_schema.ids.map((child_id: string) => this.get_object(child_class_name, child_id))
    );
  }

  get_clubs(class_name: string, object_id: string): SO_Object[] {
    let object = this.get_object(class_name, object_id);

    if (!object.club_id_data) {
      return [];
    }

    return Object.entries(object.club_id_data).map(([club_name, club_id]) => this.get_object(club_name, club_id));
  }

  get_members(class_name: string, object_id: string): SO_Object[] {
    let object = this.get_object(class_name, object_id);

    if (!object.member_id_data) {
      return [];
    }

    return Object.entries(object.member_id_data).flatMap(([member_class_name, member_schema]: [string, Sub_Schema]) =>
      member_schema.ids.map((member_id: string) => this.get_object(member_class_name, member_id))
    );
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
    let object_type = payload.object_type;
    const target_object = this.data[object_type][payload.id];

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
    let message: Message_Recieve;

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
    let object_type = payload.object_type;

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

export default Backend_State;

// message = {
//   messageType: "add",
//   payload: {
//     object_type: key,
//     object: value,
//   },
// };
// this.change_payloads.push(message);
