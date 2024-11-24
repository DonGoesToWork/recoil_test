import { Child_Schema, Schema, Schema_Property } from "./Schema";

export default class Base_Generator {
  schema: Schema;

  name: string;
  name_as_lower: string;
  name_as_upper: string;

  final_content: string;
  tab_indent = "  ";

  base_property_list: Schema_Property[] = [];
  base_property_name_list: string[] = [];

  child_property_list: Child_Schema[] = [];
  child_property_name_list: string[] = [];

  combined_property_list: string[] = [];
  combined_property_list_no_children: string[] = [];

  has_parent() {
    return this.schema.parent_object_names_list.length > 0;
  }

  has_club() {
    return this.schema.club_object_names_list.length > 0;
  }

  add_parent_fields_if_present(_arr: string[]): string[] {
    let arr = [..._arr];

    if (this.has_parent()) {
      arr.push("parent_id");
      arr.push("parent_class_name");
    }

    return arr;
  }

  get_schema_property_list_from_name(name: string) {
    return this.schema.property_list.find((x) => x.name === name);
  }

  update_lists() {
    this.base_property_list = this.schema.property_list.filter((x) => x.name !== ""); // TODO - Do stuff with properties of property_llist.
    this.base_property_name_list = this.schema.property_list.map((x) => `${x.name.toLocaleLowerCase()}`).filter((x) => x !== ""); // TODO - Do stuff with properties of property_llist.

    this.child_property_list = this.schema.child_list.filter((x) => x.name !== "");
    this.child_property_name_list = this.schema.child_list.filter((x) => x.name !== "").map((x) => x.name.toLocaleLowerCase() + "_ids");

    this.combined_property_list = this.add_parent_fields_if_present([...this.base_property_name_list, "id", ...this.child_property_name_list]);
    this.combined_property_list_no_children = this.add_parent_fields_if_present([...this.base_property_name_list, "id"]);
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
