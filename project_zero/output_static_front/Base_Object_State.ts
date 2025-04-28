// Object_State_Front.ts

export default class Base_Object_State<T> {
  protected data: Record<string, T> = {};

  set_record(id: string, inventory: T): void {
    this.data[id] = inventory;
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
