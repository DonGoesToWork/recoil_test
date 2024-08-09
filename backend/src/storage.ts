import {
  Message,
  Message_Arr,
  Payload_Add,
  Payload_Remove,
  Payload_Set,
} from "./CommunicationInterfaces";

// In-memory storage for simplicity; replace with a database in production
class BackendState {
  public data: Record<string, any[]> = {};

  set(payload: Payload_Set) {
    const existing = this.data[payload.objectType]?.find(
      (item) => item.id === payload.objectId
    );
    if (existing) {
      existing[payload.propertyName] = payload.propertyValue;
    }
  }

  add(payload: Payload_Add) {
    if (!this.data[payload.objectType]) {
      this.data[payload.objectType] = [];
    }
    this.data[payload.objectType].push(payload.object);
  }

  remove(payload: Payload_Remove) {
    this.data[payload.objectType] = this.data[payload.objectType].filter(
      (item) => item.id !== payload.objectId
    );
  }

  getFullStorage(): Message_Arr {
    let objArr = [];
    let message: Message;

    for (const [key, value] of Object.entries(this.data)) {
      for (const v of value) {
        message = {
          messageType: "add",
          payload: {
            objectType: key,
            object: v,
          },
        };

        objArr.push(message);
      }
    }

    // Create Message Array.
    let message_arr: Message_Arr = {
      messageArr: objArr,
    };

    return message_arr;
  }
}

export default BackendState;
