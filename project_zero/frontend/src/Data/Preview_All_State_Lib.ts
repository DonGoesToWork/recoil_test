import { Schema } from "./Schema";

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
    return this.schema_names.map((names) => `import { ${names}_State } from "../Shared_Object_State/${names}_State";`).join("\n") + "\n"; // Add a newline after imports
  }

  private generate_interface(): string {
    const properties = this.schema_names.map((names) => `${this.tab_indent}${names.toLocaleLowerCase()}: ${names}_State;`).join("\n");

    return `
export interface I_App_state {
${properties}
}
`;
  }

  private generate_class(): string {
    const properties = this.schema_names.map((names) => `${this.tab_indent}${names.toLocaleLowerCase()}: ${names}_State;`).join("\n");

    const constructor_assignments = this.schema_names
      .map((names) => `${this.tab_indent}${this.tab_indent}this.${names.toLocaleLowerCase()} = new ${names}_State();`)
      .join("\n");

    // Handle case with no schemas gracefully in the constructor
    const constructor_body = `\n${constructor_assignments}\n${this.tab_indent}`;

    return `
export class App_State implements I_App_state {
${properties}

${this.tab_indent}constructor() {${constructor_body}}
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
