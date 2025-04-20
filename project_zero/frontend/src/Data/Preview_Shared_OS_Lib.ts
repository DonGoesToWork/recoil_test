// Preview_Shared_OS_Lib.ts

import { Schema, Sub_Schema } from "./Schema";

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib"; // Assuming fix_schema exists and is needed
import { get_snake_case_lowercase_input } from "../Utils/utils"; // Import necessary utility functions

export default class Preview_Shared_OS_Lib extends Base_Generator {
  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    // Apply schema fixing if requested, similar to the DM lib
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.generate_state_file_content();
  }

  generate_imports(): string {
    const import_lines: string[] = [];
    const object_name = this.schema.object_name;
    const shared_data_model_path = "../Shared_Data_Models/"; // Consistent path

    import_lines.push(`import { App_State } from "../App_State/App_State";`);

    // Import SO_ for the current object
    import_lines.push(`import { SO_${object_name} } from "${shared_data_model_path}${object_name}_Interfaces";`);

    // Collect unique related object names
    const related_objects = new Set<string>();
    this.schema.parent_object_names_list.forEach((name) => related_objects.add(name));
    this.schema.child_sub_schema_arr.forEach((sub) => related_objects.add(sub.name));
    this.schema.club_object_names_list.forEach((name) => related_objects.add(name));
    this.schema.member_sub_schema_arr.forEach((sub) => related_objects.add(sub.name));

    // Import SO_ for related objects
    related_objects.forEach((related_name) => {
      // Avoid self-import if the object relates to itself (unlikely for state but possible)
      if (related_name !== object_name) {
        import_lines.push(`import { SO_${related_name} } from "${shared_data_model_path}${related_name}_Interfaces";`);
      }
    });

    // Add an empty line for separation before the class definition
    return import_lines.join("\n") + "\n";
  }

  generate_class_header(): string {
    const object_name = this.schema.object_name;
    return `export class ${object_name}_State {\n`;
  }

  generate_data_property(): string {
    const object_name = this.schema.object_name;
    return `${this.tab_indent}protected data: Record<string, SO_${object_name}> = {};\n`;
  }

  generate_standard_methods(): string {
    const object_name = this.schema.object_name;
    const so_type = `SO_${object_name}`;

    return `
${this.tab_indent}get_data(): Record<string, ${so_type}> {
${this.tab_indent}${this.tab_indent}return this.data;
${this.tab_indent}}

${this.tab_indent}protected set_record(id: string, ${this.name_as_lower}: ${so_type}): void {
${this.tab_indent}${this.tab_indent}this.data[id] = ${this.name_as_lower};
${this.tab_indent}}

${this.tab_indent}get_entries(): [string, ${so_type}][] {
${this.tab_indent}${this.tab_indent}return Object.entries(this.data);
${this.tab_indent}}

${this.tab_indent}protected set_data_entries(entries: [string, ${so_type}][]): void {
${this.tab_indent}${this.tab_indent}this.data = Object.fromEntries(entries);
${this.tab_indent}}

${this.tab_indent}get_object(object_id: string): ${so_type} | undefined {
${this.tab_indent}${this.tab_indent}return this.data[object_id];
${this.tab_indent}}

${this.tab_indent}protected set_object(object_id: string, object: ${so_type}): void {
${this.tab_indent}${this.tab_indent}this.data[object_id] = object;
${this.tab_indent}}

${this.tab_indent}get_objects(object_ids: string[] | undefined): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return object_ids?.map((id: string) => this.data[id]) ?? [];
${this.tab_indent}}\n`;
  }

  generate_parent_accessors(): string {
    let accessors = "";
    this.schema.parent_object_names_list.forEach((parent_name) => {
      const parent_name_lower_snake = get_snake_case_lowercase_input(parent_name);
      const so_type = `SO_${parent_name}`;

      accessors += `
${this.tab_indent}get_parent_${parent_name_lower_snake}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${parent_name_lower_snake}.get_objects(this.get_object(object_id)?.parent_id_data?.${parent_name_lower_snake}) ?? [];
${this.tab_indent}}\n`;
    });
    return accessors;
  }

  generate_child_accessors(): string {
    let accessors = "";
    this.schema.child_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return; // Skip empty names
      const child_name = sub_schema.name;
      const child_name_lower_snake = get_snake_case_lowercase_input(sub_schema.name);
      const so_type = `SO_${child_name}`;

      accessors += `
${this.tab_indent}get_child_${child_name_lower_snake}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${child_name_lower_snake}.get_objects(this.get_object(object_id)?.child_id_data?.${child_name_lower_snake}.ids) ?? [];
${this.tab_indent}}\n`;
    });
    return accessors;
  }

  generate_club_accessors(): string {
    let accessors = "";
    this.schema.club_object_names_list.forEach((club_name) => {
      const club_name_lower_snake = get_snake_case_lowercase_input(club_name);
      const so_type = `SO_${club_name}`;

      accessors += `
${this.tab_indent}get_club_${club_name_lower_snake}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${club_name_lower_snake}.get_objects(this.get_object(object_id)?.club_id_data?.${club_name_lower_snake}) ?? [];
${this.tab_indent}}\n`;
    });
    return accessors;
  }

  generate_member_accessors(): string {
    let accessors = "";
    this.schema.member_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return; // Skip empty names
      const member_name = sub_schema.name;
      const member_name_lower_snake = get_snake_case_lowercase_input(sub_schema.name);
      const so_type = `SO_${member_name}`;

      accessors += `
${this.tab_indent}get_member_${member_name_lower_snake}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${member_name_lower_snake}.get_objects(this.get_object(object_id)?.member_id_data?.${member_name_lower_snake}.ids) ?? [];
${this.tab_indent}}\n`;
    });
    return accessors;
  }

  generate_class_footer(): string {
    return `}\n`;
  }

  generate_state_file_content(): void {
    let content = "";
    content += this.generate_imports();
    content += "\n"; // Add a newline after imports
    content += this.generate_class_header();
    content += this.generate_data_property();
    content += "\n"; // Add a newline for spacing
    content += `${this.tab_indent}// * Logic for interacting with data on the backend.\n`;
    content += this.generate_standard_methods();
    content += `\n${this.tab_indent}// * Interactions with sub-objects\n`;
    content += this.generate_parent_accessors();
    content += this.generate_club_accessors();
    content += this.generate_child_accessors();
    content += this.generate_member_accessors();
    // Remove trailing newline if the last accessor section was empty
    content = content.trimEnd() + "\n";
    content += this.generate_class_footer();

    this.final_content = content;
  }
}
