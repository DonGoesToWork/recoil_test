import { Schema, Schema_Property, Sub_Schema } from "./Schema";

export default class Base_Generator {
  schema: Schema;

  name: string;
  name_as_lower: string;
  name_as_upper: string;

  final_content: string;
  tab_indent = "  ";

  base_property_list: Schema_Property[] = [];
  base_property_name_list: string[] = [];

  child_property_list: Sub_Schema[] = [];
  child_property_name_list: string[] = [];

  member_property_list: Sub_Schema[] = [];
  member_property_name_list: string[] = [];

  combined_property_list: string[] = [];
  combined_property_list_no_children: string[] = [];

  parent_object_names_list_lower: string[] = [];
  child_object_names_list_lower: string[] = [];
  club_object_names_list_lower: string[] = [];
  member_object_names_list_lower: string[] = [];

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

    this.child_property_list = this.schema.child_sub_schema_arr.filter((x) => x.name !== "");
    this.child_property_name_list = this.schema.child_sub_schema_arr.filter((x) => x.name !== "").map((x) => x.name);

    this.member_property_list = this.schema.member_sub_schema_arr.filter((x) => x.name !== "");
    this.member_property_name_list = this.schema.member_sub_schema_arr.filter((x) => x.name !== "").map((x) => x.name);
    
    this.combined_property_list = this.add_parent_fields_if_present([...this.base_property_name_list, "id", ...this.child_property_name_list]);
    this.combined_property_list_no_children = this.add_parent_fields_if_present([...this.base_property_name_list, "id"]);

    this.parent_object_names_list_lower = this.schema.parent_object_names_list.map((x) => x.toLocaleLowerCase());
    this.child_object_names_list_lower = this.schema.child_sub_schema_arr.map((x) => x.name.toLocaleLowerCase());
    this.club_object_names_list_lower = this.schema.club_object_names_list.map((x) => x.toLocaleLowerCase());
    this.member_object_names_list_lower = this.schema.member_sub_schema_arr.map((x) => x.name.toLocaleLowerCase());
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
