import { Schema } from "./Schema";

export default class Base_Generator {
  schema: Schema;

  name: string;
  name_as_lower: string;
  name_as_upper: string;

  final_content: string;
  tab_indent = "  ";

  base_property_list: string[] = [];
  child_property_list: string[] = [];

  combined_property_list: string[] = [];
  combined_property_list_no_children: string[] = [];

  delimeter_child_split: string = "\n";

  has_parent() {
    return this.schema.parent !== "";
  }

  add_parent_id(arr: string[]): string[] {
    if (this.has_parent()) {
      return [...arr, "parent_id"];
    }

    return arr;
  }

  update_lists() {
    this.base_property_list = this.schema.property_list.map((x) => `${x.name.toLocaleLowerCase()}`).filter((x) => x !== ""); // TODO - Do stuff with properties of property_llist.

    this.child_property_list = this.schema.child_list
      .split(this.delimeter_child_split)
      .filter((x) => x !== "")
      .map((x) => x.toLocaleLowerCase() + "_ids");

    this.combined_property_list = this.add_parent_id([...this.base_property_list, "id", ...this.child_property_list]);
    this.combined_property_list_no_children = this.add_parent_id([...this.base_property_list, "id"]);
  }

  constructor(schema: Schema) {
    this.schema = schema;

    this.name = this.schema.object_name;
    this.name_as_lower = this.name.toLocaleLowerCase();
    this.name_as_upper = this.name.toLocaleUpperCase();

    this.final_content = "";
    this.update_lists();
  }
}
