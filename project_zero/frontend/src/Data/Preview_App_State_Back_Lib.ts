import { Schema } from "./Schema"; // Assuming Schema is in the same directory or path is adjusted
import { get_pascal_case } from "../Utils/utils"; // Assuming utils path

export default class Preview_App_State_Lib {
  schemas: Schema[];
  schema_names: string[];
  public final_content: string;
  tab_indent = "  ";

  // no need to 'fix schemas' here
  constructor(schemas: Schema[]) {
    this.schemas = schemas;
    this.schema_names = this.schemas.map((schema) => schema.object_name);
    this.final_content = this.generate_app_state_content();
  }

  private generate_imports(): string {
    // Import State types for each schema
    const state_imports = this.schema_names.map((x) => `import { ${x}_State } from "../Shared_Object_State/${x}_State";`).join("\n");

    // Import Change_Payload_Manager
    const change_payload_manager_import = `import Change_Payload_Manager from "../../static_internal_logic/Change_Payload_Manager";`;

    return `${state_imports}\n${change_payload_manager_import}\n`;
  }

  private generate_interface(): string {
    const properties = this.schemas.map((schema) => `${this.tab_indent}${schema.object_name.toLocaleLowerCase()}: ${schema.object_name}_State;`).join("\n");

    return `
export interface I_App_state {
${properties}
}
`;
  }

  private generate_class(): string {
    // Generate property declarations
    const properties = this.schemas.map((schema) => `${this.tab_indent}${schema.object_name.toLocaleLowerCase()}: ${schema.object_name}_State;`).join("\n");

    // Generate constructor assignments
    const constructor_assignments = this.schemas
      .map((schema) => `${this.tab_indent}${this.tab_indent}this.${schema.object_name.toLocaleLowerCase()} = new ${schema.object_name}_State();`)
      .join("\n");

    // Generate calls within get_full_storage
    const get_full_storage_calls = this.schemas
      .map(
        (schema) =>
          `${this.tab_indent}${this.tab_indent}this.create_object_add_payloads(app_state.${schema.object_name.toLocaleLowerCase()}, "${get_pascal_case(
            schema.object_name // Use PascalCase name for the string argument
          )}", this.change_payload_manager);`
      )
      .join("\n");

    return `
export default class App_State implements I_App_state {
${this.tab_indent}change_payload_manager: Change_Payload_Manager = new Change_Payload_Manager();

${properties}

${this.tab_indent}constructor() {
${constructor_assignments}
${this.tab_indent}}

${this.tab_indent}private create_object_add_payloads(object_state: Record<string, any>, class_name: string, pm: Change_Payload_Manager) {
${this.tab_indent}${this.tab_indent}object_state.get_entries().forEach((v: any) => {
${this.tab_indent}${this.tab_indent}${this.tab_indent}pm.add_add_payload({ object_id: v[0], object_type: class_name, object: v[1] });
${this.tab_indent}${this.tab_indent}});
${this.tab_indent}}

${this.tab_indent}get_full_storage(app_state: App_State): Change_Payload_Manager {
${get_full_storage_calls}
${this.tab_indent}${this.tab_indent}return this.change_payload_manager;
${this.tab_indent}}

${this.tab_indent}clear_changes(): void {
${this.tab_indent}${this.tab_indent}this.change_payload_manager.clear();
${this.tab_indent}}
}
`;
  }

  private generate_app_state_content(): string {
    let content = "";
    content += this.generate_imports();
    content += this.generate_interface();
    content += this.generate_class();
    return content;
  }
}
