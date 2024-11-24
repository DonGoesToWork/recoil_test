import { Message_Arr_Recieve, Message_Recieve, Payload_Add, Payload_Delete, Payload_Set } from "../z_generated/Shared_Misc/Communication_Interfaces";

import { GLOBAL_CLASS_MAP } from "../z_generated/Data_Registration/Global_Class_Map";

// In-memory storage for simplicity; replace with a database in production
class Backend_State {
  public data: Record<string, any> = {}; // must use any due to: https://github.com/microsoft/TypeScript/issues/40803

  // public data: Partial<RpgDataSchema> = {};
  public change_payloads: Message_Arr_Recieve = {
    messageArr: [],
  };

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

    this.change_payloads.messageArr.push(message);
  }

  add(payload: Payload_Add) {
    let object_type = payload.object_type;

    // Sanity check.
    if (GLOBAL_CLASS_MAP[object_type] === undefined) {
      console.log("Fatal error: Tried to add object of unsupported type: " + object_type);
      return;
    }

    // If first entry, prepare array.
    if (!this.data[object_type]) {
      this.data[object_type] = [];
    }

    if (!payload.object.id) {
      console.log("Fatal error: Can't add object with no id: ", object_type, payload);
      return;
    }

    this.data[object_type].push({ [payload.object.id]: payload.object });

    // this.data[object_type].push(payload.object);

    // Create payload to send to front-end.
    let message: Message_Recieve;

    message = {
      messageType: "add",
      payload,
    };

    this.change_payloads.messageArr.push(message);
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

    this.change_payloads.messageArr.push(message);
  }

  get_full_storage(): Message_Arr_Recieve {
    let message: Message_Recieve;

    for (const [key, value] of Object.entries(this.data)) {
      for (const v of value) {
        message = {
          messageType: "add",
          payload: {
            object_type: key,
            object: v,
          },
        };

        this.change_payloads.messageArr.push(message);
      }
    }

    return this.change_payloads;
  }

  clearChanges(): void {
    this.change_payloads = {
      messageArr: [],
    };
  }
}

export default Backend_State;
