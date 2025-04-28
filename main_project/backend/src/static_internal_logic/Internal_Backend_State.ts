// import { Payload_Add, Payload_Delete, Payload_Set } from "../z_generated/Shared_Misc/Communication_Interfaces";

// import { App_State } from "../z_generated/App_State/App_State";
// import Change_Payload_Manager from "./Change_Payload_Manager";
// import { SO_Object } from "../z_generated/Shared_Misc/Sub_Schema";

// In Internal_Backend_State, we do 'hacky' operations to avoid writting a whole bunch of code and achieve major performance gains.
// Specifically, we typecast our 'app_state' and 'payload' objects as objects that we can assume they are when necessary.
// If there were a better way to do this, I would do it, but unfortunately, this is the only real solution.

// TODO:
// Rename App_State to App_State_Base
// Rename this to Internal_Backend_State

// export class Internal_Backend_State extends App_State {
/**
   * goal is to remove all of set/add/delete from here

  // set a property
  set(app_state: App_State, payload: Payload_Set) {
    if (!(payload.object_type in app_state)) {
      console.log("Fatal error: Payload object type is not a member of app state.");
      return;
    }

    // Perform the set and send payload.
    let obj = (app_state as any)[payload.object_type].get_object(payload.id) as SO_Object;

    obj
      ? (obj[payload.property_l1_name] = payload.property_value)
      : console.log("Fatal error: Object type " + payload.object_type + " with id " + payload.id + " missing  found.");

    this.change_payload_manager.add_set_payload(payload);
  }

  // add a new object
  add(app_state: App_State, payload: Payload_Add) {
    if (!(payload.object_type in app_state)) {
      console.log("Fatal error: Payload object type is not a member of app state.");
      return;
    }

    (app_state as any)[payload.object_type].set_record(payload.object_id, payload.object);
    this.change_payload_manager.add_add_payload(payload);
  }

  // delete an existing object
  delete(app_state: App_State, payload: Payload_Delete) {
    if (!(payload.object_type in app_state)) {
      console.log("Fatal error: Payload object type is not a member of app state.");
      return;
    }

    // Perform delete record operation and create payload to send to front-end.
    (app_state as any)[payload.object_type].delete_record(payload.objectId);
    this.change_payload_manager.add_delete_payload(payload);
  }

 */
// }
