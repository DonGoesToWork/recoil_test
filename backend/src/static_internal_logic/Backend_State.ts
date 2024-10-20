import { Message_Arr_Recieve, Message_Recieve, Payload_Add, Payload_Remove, Payload_Set } from "../shared/Communication/Communication_Interfaces";

// In-memory storage for simplicity; replace with a database in production
class Backend_State {
  public data: Record<string, any[]> = {};
  public change_payloads: Message_Arr_Recieve = {
    messageArr: [],
  };

  set(payload: Payload_Set) {
    const existing = this.data[payload.objectType]?.find((item) => item.id === payload.id);

    if (existing) {
      // Change internal state
      existing[payload.propertyName] = payload.propertyValue;

      // Create payload to send to front-end.
      let message: Message_Recieve;

      message = {
        messageType: "set",
        payload,
      };

      this.change_payloads.messageArr.push(message);
    } else {
      console.log("Fatal error. Object not found.");
    }
  }

  add(payload: Payload_Add) {
    if (!this.data[payload.objectType]) {
      this.data[payload.objectType] = [];
    }
    this.data[payload.objectType].push(payload.object);

    // Create payload to send to front-end.
    let message: Message_Recieve;

    message = {
      messageType: "add",
      payload,
    };

    this.change_payloads.messageArr.push(message);
  }

  remove(payload: Payload_Remove) {
    this.data[payload.objectType] = this.data[payload.objectType].filter((item) => item.id !== payload.objectId);

    // Create payload to send to front-end.
    let message: Message_Recieve;

    message = {
      messageType: "remove",
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
            objectType: key,
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
