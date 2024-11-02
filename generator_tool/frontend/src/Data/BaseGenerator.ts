import { Note } from "./Note";

export default class BaseGenerator {
  note: Note;
  finalContent: string;
  tab_indent = "  ";

  user_base_property_list: string[] = [];
  user_property_list_raw: string[] = [];
  base_property_list: string[] = [];
  child_property_list: string[] = [];

  user_property_list: string[] = [];
  combined_property_list: string[] = [];
  combined_property_list_no_gen: string[] = [];

  user_propery_list_dual: string[] = [];
  delimeter_child_split: string = "\n";

  has_parent() {
    return this.note.parent !== "";
  }

  update_lists() {
    this.user_property_list_raw = this.note.user_property_list.split("\n").filter((x) => x !== "");

    this.base_property_list = this.note.property_list.split("\n").filter((x) => x !== "");

    this.child_property_list = this.note.child_list
      .split(this.delimeter_child_split)
      .filter((x) => x !== "")
      .map((x) => x.toLocaleLowerCase() + "_ids");

    this.user_property_list = this.user_property_list_raw.map((x) => x + "_user_input");

    this.user_propery_list_dual = [...this.user_property_list_raw, ...this.user_property_list];

    this.user_base_property_list = [...this.user_property_list, ...this.base_property_list];

    this.combined_property_list = [...this.user_property_list_raw, ...this.user_base_property_list, "id", ...this.child_property_list];

    this.combined_property_list_no_gen = [...this.user_property_list_raw, ...this.user_base_property_list];

    if (this.has_parent()) {
      this.combined_property_list.push("parent_id");
    }
  }
  constructor(note: Note) {
    this.note = note;
    this.finalContent = "";
    this.update_lists();
  }
}
