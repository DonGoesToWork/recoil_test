import { Schema } from "./Schema"; // Assuming Schema is in the same directory or path is adjusted

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
    return `${state_imports}\n`;
  }

  private generate_interface(): string {
    const properties = this.schemas.map((schema) => `${this.tab_indent}${schema.object_name.toLocaleLowerCase()}: ${schema.object_name}_State;`).join("\n");

    return `
export interface I_App_state {
${this.tab_indent}server_state_ref: string;
${properties}
}
`;
  }

  private generate_class(): string {
    // Generate property declarations1
    const properties = this.schemas.map((schema) => `${this.tab_indent}${schema.object_name.toLocaleLowerCase()}: ${schema.object_name}_State;`).join("\n");

    // Generate constructor assignments
    const constructor_assignments = this.schemas
      .map((schema) => `${this.tab_indent}${this.tab_indent}this.${schema.object_name.toLocaleLowerCase()} = new ${schema.object_name}_State();`)
      .join("\n");

    return `
export default class App_State implements I_App_state {
${this.tab_indent}server_state_ref = "";
${properties}

${this.tab_indent}constructor() {
${constructor_assignments}
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
