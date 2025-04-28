// Object_State_back.ts

import App_State from "./App_State";
import { Payload_Add } from "../Shared_Misc/Communication_Interfaces";

export default class Base_Object_State<T> {
  protected data: Record<string, T> = {};

  set_record(state: App_State, class_name: string, id: string, inventory: T): void {
    this.data[id] = inventory;
    const payload: Payload_Add = { object_id: id, object_type: class_name, object: this.data[id] };
    state.change_payload_manager.add_add_payload(payload);
  }

  get_data(): Record<string, T> {
    return this.data;
  }

  get_entries(): [string, T][] {
    return Object.entries(this.data);
  }

  protected set_data_entries(entries: [string, T][]): void {
    this.data = Object.fromEntries(entries);
  }

  get_object(object_id: string): T | undefined {
    return this.data[object_id];
  }

  protected set_object(object_id: string, object: T): void {
    this.data[object_id] = object;
  }

  get_objects(object_ids: string[] | undefined): T[] {
    return object_ids?.map((id: string) => this.data[id]) ?? [];
  }
}
