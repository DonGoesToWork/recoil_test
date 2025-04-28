// Change payloads represent, well, payloads that get sent to the front-end to update its state.

import { Message_Receive, Payload_Add, Payload_Delete, Payload_Set, Payload_Type } from "../z_generated/Shared_Misc/Communication_Interfaces";

// They are automatically sent to all clients (in index.ts) once a transaction completes.
export default class Change_Payload_Manager {
  public change_payloads: Message_Receive[] = [];

  get_crafted_payload(type: string, payload: Payload_Type): Message_Receive {
    return {
      messageType: type,
      payload,
    };
  }

  add_set_payload(payload: Payload_Set): void {
    this.change_payloads.push(this.get_crafted_payload("set", payload));
  }

  add_add_payload(payload: Payload_Add): void {
    this.change_payloads.push(this.get_crafted_payload("add", payload));
  }

  add_delete_payload(payload: Payload_Delete): void {
    this.change_payloads.push(this.get_crafted_payload("delete", payload));
  }

  clear() {
    this.change_payloads = [];
  }
}
