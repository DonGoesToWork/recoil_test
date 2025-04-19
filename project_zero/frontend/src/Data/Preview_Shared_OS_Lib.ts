// Preview_Shared_OS_Lib.ts

import { Schema, Sub_Schema } from "./Schema";
import { get_snake_case_lowercase_input, pascal_case } from "../Utils/utils"; // Import necessary utility functions

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib"; // Assuming fix_schema exists and is needed

export default class Preview_Shared_OS_Lib extends Base_Generator {
  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    // Apply schema fixing if requested, similar to the DM lib
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.generate_state_file_content();
  }

  // Helper to generate PascalCase names for related objects
  private get_pascal_case_name(name: string): string {
    // Assuming names in schema might have underscores, replace them first, then PascalCase
    return pascal_case(name.replace(/_/g, " "));
  }

  generate_imports(): string {
    const import_lines: string[] = [];
    const object_name_pascal = this.get_pascal_case_name(this.schema.object_name);
    const shared_data_model_path = "../z_generated/Shared_Data_Models/"; // Consistent path

    // Import MO_ and SO_ for the current object
    import_lines.push(
      `import { MO_${object_name_pascal}, SO_${object_name_pascal} } from "${shared_data_model_path}${object_name_pascal}";`
    );

    // Collect unique related object names
    const related_objects = new Set<string>();
    this.schema.parent_object_names_list.forEach((name) => related_objects.add(this.get_pascal_case_name(name)));
    this.schema.child_sub_schema_arr.forEach((sub) => related_objects.add(this.get_pascal_case_name(sub.name)));
    this.schema.club_object_names_list.forEach((name) => related_objects.add(this.get_pascal_case_name(name)));
    this.schema.member_sub_schema_arr.forEach((sub) => related_objects.add(this.get_pascal_case_name(sub.name)));

    // Import MO_ and SO_ for related objects
    related_objects.forEach((related_name_pascal) => {
      // Avoid self-import if the object relates to itself (unlikely for state but possible)
      if (related_name_pascal !== object_name_pascal) {
        import_lines.push(
          `import { MO_${related_name_pascal}, SO_${related_name_pascal} } from "${shared_data_model_path}${related_name_pascal}";`
        );
      }
    });

    // Import All_State (assuming path)
    import_lines.push(`import { All_State } from "./All_State";`);

    // Add an empty line for separation before the class definition
    return import_lines.join("\n") + "\n";
  }

  generate_class_header(): string {
    const object_name_pascal = this.get_pascal_case_name(this.schema.object_name);
    return `export class ${object_name_pascal}_State {\n`;
  }

  generate_data_property(): string {
    const object_name_pascal = this.get_pascal_case_name(this.schema.object_name);
    return `${this.tab_indent}protected data: Record<string, SO_${object_name_pascal}> = {};\n`;
  }

  generate_standard_methods(): string {
    const object_name_pascal = this.get_pascal_case_name(this.schema.object_name);
    const so_type = `SO_${object_name_pascal}`;

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
${this.tab_indent}}\n`;
  }

  generate_parent_accessors(): string {
    let accessors = "";
    this.schema.parent_object_names_list.forEach((parent_name) => {
      const parent_name_pascal = this.get_pascal_case_name(parent_name);
      const parent_name_lower_snake = get_snake_case_lowercase_input(parent_name);
      const so_type = `SO_${parent_name_pascal}`;
      const mo_type = `MO_${parent_name_pascal}`;

      accessors += `
${this.tab_indent}get_parent_${parent_name_lower_snake}(all_state: All_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}const object = this.get_object(object_id);
${this.tab_indent}${this.tab_indent}return object?.parent_id_data?.${parent_name_lower_snake}
${this.tab_indent}${this.tab_indent}${this.tab_indent}? object.parent_id_data.${parent_name_lower_snake}.map((${parent_name_lower_snake}_id: string) =>
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}all_state.get_object(${mo_type}.class_name, ${parent_name_lower_snake}_id) as ${so_type} // Type assertion
${this.tab_indent}${this.tab_indent}${this.tab_indent})
${this.tab_indent}${this.tab_indent}${this.tab_indent}: [];
${this.tab_indent}}\n`;
    });
    return accessors;
  }

  generate_child_accessors(): string {
    let accessors = "";
    this.schema.child_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return; // Skip empty names
      const child_name_pascal = this.get_pascal_case_name(sub_schema.name);
      const child_name_lower_snake = get_snake_case_lowercase_input(sub_schema.name);
      const so_type = `SO_${child_name_pascal}`;
      const mo_type = `MO_${child_name_pascal}`;

      accessors += `
${this.tab_indent}get_children_${child_name_lower_snake}(all_state: All_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}const object = this.get_object(object_id);
${this.tab_indent}${this.tab_indent}return object?.child_id_data?.${child_name_lower_snake}?.ids
${this.tab_indent}${this.tab_indent}${this.tab_indent}? object.child_id_data.${child_name_lower_snake}.ids.map((${child_name_lower_snake}_id: string) =>
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}all_state.get_object(${mo_type}.class_name, ${child_name_lower_snake}_id) as ${so_type} // Type assertion
${this.tab_indent}${this.tab_indent}${this.tab_indent})
${this.tab_indent}${this.tab_indent}${this.tab_indent}: [];
${this.tab_indent}}\n`;
    });
    return accessors;
  }

  generate_club_accessors(): string {
    let accessors = "";
    this.schema.club_object_names_list.forEach((club_name) => {
      const club_name_pascal = this.get_pascal_case_name(club_name);
      const club_name_lower_snake = get_snake_case_lowercase_input(club_name);
      const so_type = `SO_${club_name_pascal}`;
      const mo_type = `MO_${club_name_pascal}`;

      accessors += `
${this.tab_indent}get_club_${club_name_lower_snake}(all_state: All_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}const object = this.get_object(object_id);
${this.tab_indent}${this.tab_indent}return object?.club_id_data?.${club_name_lower_snake}
${this.tab_indent}${this.tab_indent}${this.tab_indent}? object.club_id_data.${club_name_lower_snake}.map((${club_name_lower_snake}_id: string) =>
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}all_state.get_object(${mo_type}.class_name, ${club_name_lower_snake}_id) as ${so_type} // Type assertion
${this.tab_indent}${this.tab_indent}${this.tab_indent})
${this.tab_indent}${this.tab_indent}${this.tab_indent}: [];
${this.tab_indent}}\n`;
    });
    return accessors;
  }

  generate_member_accessors(): string {
    let accessors = "";
    this.schema.member_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
        if (!sub_schema.name) return; // Skip empty names
      const member_name_pascal = this.get_pascal_case_name(sub_schema.name);
      const member_name_lower_snake = get_snake_case_lowercase_input(sub_schema.name);
      const so_type = `SO_${member_name_pascal}`;
      const mo_type = `MO_${member_name_pascal}`;

      accessors += `
${this.tab_indent}get_members_${member_name_lower_snake}(all_state: All_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}const object = this.get_object(object_id);
${this.tab_indent}${this.tab_indent}return object?.member_id_data?.${member_name_lower_snake}?.ids
${this.tab_indent}${this.tab_indent}${this.tab_indent}? object.member_id_data.${member_name_lower_snake}.ids.map((${member_name_lower_snake}_id: string) =>
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}all_state.get_object(${mo_type}.class_name, ${member_name_lower_snake}_id) as ${so_type} // Type assertion
${this.tab_indent}${this.tab_indent}${this.tab_indent})
${this.tab_indent}${this.tab_indent}${this.tab_indent}: [];
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
    content += `${this.tab_indent}// * Interactions with sub-objects\n`;
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
