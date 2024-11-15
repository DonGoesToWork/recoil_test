import { Note } from "./Note";

export default class BaseGenerator {
  note: Note;

  name: string;
  name_as_lower: string;
  name_as_upper: string;

  finalContent: string;
  tab_indent = "  ";

  base_property_list: string[] = [];
  child_property_list: string[] = [];

  combined_property_list: string[] = [];
  combined_property_list_no_children: string[] = [];

  delimeter_child_split: string = "\n";

  has_parent() {
    return this.note.parent !== "";
  }

  add_parent_id(arr: string[]): string[] {
    if (this.has_parent()) {
      return [...arr, "parent_id"];
    }

    return arr;
  }

  update_lists() {
    this.base_property_list = this.note.property_list.map((x) => `${x.name}`).filter((x) => x !== ""); // TODO - Do stuff with properties of property_llist.

    this.child_property_list = this.note.child_list
      .split(this.delimeter_child_split)
      .filter((x) => x !== "")
      .map((x) => x.toLocaleLowerCase() + "_ids");

    this.combined_property_list = this.add_parent_id([...this.base_property_list, "id", ...this.child_property_list]);
    this.combined_property_list_no_children = this.add_parent_id([...this.base_property_list, "id"]);
  }

  constructor(note: Note) {
    this.note = note;

    this.name = this.note.object_name;
    this.name_as_lower = this.name.toLocaleLowerCase();
    this.name_as_upper = this.name.toLocaleUpperCase();

    this.finalContent = "";
    this.update_lists();
  }
}
