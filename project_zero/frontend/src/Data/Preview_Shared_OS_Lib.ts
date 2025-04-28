// Preview_Shared_OS_Lib.ts

import { Schema, Sub_Schema } from "./Schema";

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib";
import { get_snake_case_lowercase_input } from "../Utils/utils"; // Keep utility import

export default class Preview_Shared_OS_Lib extends Base_Generator {
  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.generate_state_file_content(); // Call the main generation function
  }

  // Import Shared_Object_State correctly
  // Import SO_ interfaces for current and related objects
  generate_imports(): string {
    const import_lines: string[] = [];
    const object_name = this.schema.object_name;
    const shared_data_model_path = "../Shared_Data_Models/";

    import_lines.push(`import App_State from "../App_State/App_State";`);
    import_lines.push(`import Base_Object_State from "../App_State/Base_Object_State";`);
    import_lines.push(`import { SO_${object_name} } from "${shared_data_model_path}${object_name}_Interfaces";`);

    const related_objects = new Set<string>();
    this.schema.parent_object_names_list.forEach((name) => name && related_objects.add(name));
    this.schema.child_sub_schema_arr.forEach((sub) => sub.name && related_objects.add(sub.name));
    this.schema.club_object_names_list.forEach((name) => name && related_objects.add(name));
    this.schema.member_sub_schema_arr.forEach((sub) => sub.name && related_objects.add(sub.name));

    related_objects.forEach((related_name) => {
      // Check related_name exists and avoid self-import
      if (related_name && related_name !== object_name) {
        import_lines.push(`import { SO_${related_name} } from "${shared_data_model_path}${related_name}_Interfaces";`);
      }
    });

    // No sorting needed as per original examples
    return import_lines.join("\n");
  }

  // Generate class signature extending Base_Object_State
  generate_class_header(): string {
    const object_name = this.schema.object_name;
    return `export class ${object_name}_State extends Base_Object_State<SO_${object_name}> {`;
  }

  // Generate getters for parents, clubs, children, members
  generate_relation_getters(): string {
    let getters = "";

    // Parent Getters
    this.schema.parent_object_names_list.forEach((parent_name) => {
      if (!parent_name) return;
      const parent_name_snake_case = get_snake_case_lowercase_input(parent_name);
      const so_type = `SO_${parent_name}`;
      getters += `
${this.tab_indent}get_parent_${parent_name_snake_case}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${parent_name_snake_case}.get_objects(this.get_object(object_id)?.parent_id_data?.${parent_name_snake_case}) ?? [];
${this.tab_indent}}\n`;
    });

    // Club Getters
    this.schema.club_object_names_list.forEach((club_name) => {
      if (!club_name) return;
      const club_name_snake_case = get_snake_case_lowercase_input(club_name);
      const so_type = `SO_${club_name}`;
      getters += `
${this.tab_indent}get_club_${club_name_snake_case}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${club_name_snake_case}.get_objects(this.get_object(object_id)?.club_id_data?.${club_name_snake_case}) ?? [];
${this.tab_indent}}\n`;
    });

    // Child Getters
    this.schema.child_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return;
      const child_name = sub_schema.name;
      const child_name_snake_case = get_snake_case_lowercase_input(child_name);
      const so_type = `SO_${child_name}`;
      getters += `
${this.tab_indent}get_child_${child_name_snake_case}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${child_name_snake_case}.get_objects(this.get_object(object_id)?.child_id_data?.${child_name_snake_case}.ids) ?? [];
${this.tab_indent}}\n`;
    });

    // Member Getters
    this.schema.member_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return;
      const member_name = sub_schema.name;
      const member_name_snake_case = get_snake_case_lowercase_input(member_name);
      const so_type = `SO_${member_name}`;
      getters += `
${this.tab_indent}get_member_${member_name_snake_case}(app_state: App_State, object_id: string): ${so_type}[] {
${this.tab_indent}${this.tab_indent}return app_state.${member_name_snake_case}.get_objects(this.get_object(object_id)?.member_id_data?.${member_name_snake_case}.ids) ?? [];
${this.tab_indent}}\n`;
    });

    // Add section header if any getters were generated
    if (getters.length > 0) {
      getters = `\n${this.tab_indent}// * get relation objects\n` + getters;
    }

    return getters;
  }

  // Generate private removal methods for updating relationships
  generate_relation_removers(): string {
    let removers = "";
    const current_object_name = this.schema.object_name;
    const current_object_snake_case = get_snake_case_lowercase_input(current_object_name);

    // Remove From Parent Methods
    this.schema.parent_object_names_list.forEach((parent_name) => {
      if (!parent_name) return;
      const parent_name_snake_case = get_snake_case_lowercase_input(parent_name);
      const so_parent_type = `SO_${parent_name}`;
      removers += `
${this.tab_indent}private remove_from_parent_${parent_name_snake_case}(app_state: App_State, object_id: string): void {
${this.tab_indent}${this.tab_indent}this.get_parent_${parent_name_snake_case}(app_state, object_id).forEach((parent: ${so_parent_type}) => {
${this.tab_indent}${this.tab_indent}${this.tab_indent}if (parent.child_id_data?.${current_object_snake_case}) {
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}parent.child_id_data.${current_object_snake_case}.ids = parent.child_id_data.${current_object_snake_case}.ids.filter((child_id) => child_id !== object_id);
${this.tab_indent}${this.tab_indent}${this.tab_indent}}
${this.tab_indent}${this.tab_indent}});
${this.tab_indent}}\n`;
    });

    // Remove From Club Methods
    this.schema.club_object_names_list.forEach((club_name) => {
      if (!club_name) return;
      const club_name_snake_case = get_snake_case_lowercase_input(club_name);
      const so_club_type = `SO_${club_name}`;
      removers += `
${this.tab_indent}private remove_from_club_${club_name_snake_case}(app_state: App_State, object_id: string): void {
${this.tab_indent}${this.tab_indent}this.get_club_${club_name_snake_case}(app_state, object_id).forEach((club: ${so_club_type}) => {
${this.tab_indent}${this.tab_indent}${this.tab_indent}if (club.member_id_data?.${current_object_snake_case}) {
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}club.member_id_data.${current_object_snake_case}.ids = club.member_id_data.${current_object_snake_case}.ids.filter((member_id) => member_id !== object_id);
${this.tab_indent}${this.tab_indent}${this.tab_indent}}
${this.tab_indent}${this.tab_indent}});
${this.tab_indent}}\n`;
    });

    // Remove Child Methods (Recursive Delete)
    this.schema.child_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return;
      const child_name = sub_schema.name;
      const child_name_snake_case = get_snake_case_lowercase_input(child_name);
      const so_child_type = `SO_${child_name}`;
      removers += `
${this.tab_indent}private remove_child_${child_name_snake_case}(app_state: App_State, object_id: string): void {
${this.tab_indent}${this.tab_indent}const to_delete_child_ids: string[] = [];
${this.tab_indent}${this.tab_indent}const children = this.get_child_${child_name_snake_case}(app_state, object_id);

${this.tab_indent}${this.tab_indent}children.forEach((child: ${so_child_type}) => {
${this.tab_indent}${this.tab_indent}${this.tab_indent}if (child.parent_id_data?.${current_object_snake_case}) {
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}child.parent_id_data.${current_object_snake_case} = child.parent_id_data.${current_object_snake_case}.filter((parent_id) => parent_id !== object_id);
${this.tab_indent}${this.tab_indent}${this.tab_indent}}
${this.tab_indent}${this.tab_indent}${this.tab_indent}if (app_state.${child_name_snake_case}.has_no_parents(child)) {
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}to_delete_child_ids.push(child.id);
${this.tab_indent}${this.tab_indent}${this.tab_indent}}
${this.tab_indent}${this.tab_indent}});

${this.tab_indent}${this.tab_indent}to_delete_child_ids.forEach((id_to_delete) => {
${this.tab_indent}${this.tab_indent}${this.tab_indent}app_state.${child_name_snake_case}.delete_record(app_state, id_to_delete);
${this.tab_indent}${this.tab_indent}});
${this.tab_indent}}\n`;
    });

    // Remove Member Methods
    this.schema.member_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return;
      const member_name = sub_schema.name;
      const member_name_snake_case = get_snake_case_lowercase_input(member_name);
      const so_member_type = `SO_${member_name}`;
      removers += `
${this.tab_indent}private remove_member_${member_name_snake_case}(app_state: App_State, object_id: string): void {
${this.tab_indent}${this.tab_indent}this.get_member_${member_name_snake_case}(app_state, object_id).forEach((member: ${so_member_type}) => {
${this.tab_indent}${this.tab_indent}${this.tab_indent}if (member.club_id_data?.${current_object_snake_case}) {
${this.tab_indent}${this.tab_indent}${this.tab_indent}${this.tab_indent}member.club_id_data.${current_object_snake_case} = member.club_id_data.${current_object_snake_case}.filter((club_id) => club_id !== object_id);
${this.tab_indent}${this.tab_indent}${this.tab_indent}}
${this.tab_indent}${this.tab_indent}});
${this.tab_indent}}\n`;
    });

    // Add section header if any removers were generated
    if (removers.length > 0) {
      removers = `\n${this.tab_indent}// * relation remove methods\n` + removers;
    }

    return removers;
  }

  // Generate the has_no_parents utility method
  generate_has_no_parents(): string {
    const object_name = this.schema.object_name;
    const so_type = `SO_${object_name}`;

    let method_content = "";

    if (this.schema.parent_object_names_list.length === 0) {
      method_content = `
${this.tab_indent}${this.tab_indent}return true;`;
    } else {
      const parent_checks = this.schema.parent_object_names_list
        .map((parent_name) => {
          if (!parent_name) return null;
          const parent_name_snake_case = get_snake_case_lowercase_input(parent_name);
          return `(!object.parent_id_data?.${parent_name_snake_case} || object.parent_id_data.${parent_name_snake_case}.length === 0)`;
        })
        .filter(Boolean)
        .join(` &&\n${this.tab_indent}${this.tab_indent}${this.tab_indent}`);

      method_content = `
${this.tab_indent}${this.tab_indent}return !object?.parent_id_data || (${parent_checks});`;
    }

    return `
${this.tab_indent}// * relationship utility function(s)

${this.tab_indent}has_no_parents(object: ${so_type}): boolean {${method_content}
${this.tab_indent}}\n`;
  }

  // Generate the main delete_record method orchestrating removals
  generate_delete_record(): string {
    const object_name = this.schema.object_name;
    const so_type = `SO_${object_name}`;

    let delete_calls = "";

    // Parent removal calls
    this.schema.parent_object_names_list.forEach((parent_name) => {
      if (!parent_name) return;
      const parent_name_snake_case = get_snake_case_lowercase_input(parent_name);
      delete_calls += `${this.tab_indent}${this.tab_indent}this.remove_from_parent_${parent_name_snake_case}(app_state, id);\n`;
    });
    if (
      this.schema.parent_object_names_list.length > 0 &&
      (this.schema.club_object_names_list.length > 0 || this.schema.child_sub_schema_arr.length > 0 || this.schema.member_sub_schema_arr.length > 0)
    ) {
      delete_calls += "\n";
    }

    // Club removal calls
    this.schema.club_object_names_list.forEach((club_name) => {
      if (!club_name) return;
      const club_name_snake_case = get_snake_case_lowercase_input(club_name);
      delete_calls += `${this.tab_indent}${this.tab_indent}this.remove_from_club_${club_name_snake_case}(app_state, id);\n`;
    });
    if (this.schema.club_object_names_list.length > 0 && (this.schema.child_sub_schema_arr.length > 0 || this.schema.member_sub_schema_arr.length > 0)) {
      delete_calls += "\n";
    }

    // Child removal calls
    this.schema.child_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return;
      const child_name_snake_case = get_snake_case_lowercase_input(sub_schema.name);
      delete_calls += `${this.tab_indent}${this.tab_indent}this.remove_child_${child_name_snake_case}(app_state, id);\n`;
    });

    // Member removal calls
    this.schema.member_sub_schema_arr.forEach((sub_schema: Sub_Schema) => {
      if (!sub_schema.name) return;
      const member_name_snake_case = get_snake_case_lowercase_input(sub_schema.name);
      delete_calls += `${this.tab_indent}${this.tab_indent}this.remove_member_${member_name_snake_case}(app_state, id);\n`;
    });

    // Add final newline if any children or members exist
    if (this.schema.child_sub_schema_arr.length > 0 || this.schema.member_sub_schema_arr.length > 0) {
      delete_calls += "\n";
    }

    return `
${this.tab_indent}// * main relationship delete utility function

${this.tab_indent}delete_record(app_state: App_State, id: string): void {
${this.tab_indent}${this.tab_indent}const object_to_delete = this.get_object(id);

${this.tab_indent}${this.tab_indent}if (!object_to_delete) {
${this.tab_indent}${this.tab_indent}${this.tab_indent}console.log("Record delete validation error: Object to delete doesn't exist - ${so_type}: " + id + ".");
${this.tab_indent}${this.tab_indent}${this.tab_indent}return;
${this.tab_indent}${this.tab_indent}}

${delete_calls.trimEnd()}

${this.tab_indent}${this.tab_indent}delete this.data[id];
${this.tab_indent}}\n`;
  }

  generate_class_footer(): string {
    return `}\n`;
  }

  // Main function to orchestrate the generation of the state file content
  generate_state_file_content(): void {
    let content = "";
    content += this.generate_imports();
    content += "\n\n"; // Double newline after imports
    content += this.generate_class_header();

    const getters = this.generate_relation_getters();
    const removers = this.generate_relation_removers();
    const hasNoParents = this.generate_has_no_parents();
    const deleteRecord = this.generate_delete_record();

    content += getters; // Includes header comment if getters exist
    content += removers; // Includes header comment if removers exist
    content += hasNoParents; // Includes header comment
    content += deleteRecord; // Includes header comment

    // Remove trailing newline before adding the class footer
    content = content.trimEnd() + "\n";

    content += this.generate_class_footer();

    this.final_content = content;
  }
}
