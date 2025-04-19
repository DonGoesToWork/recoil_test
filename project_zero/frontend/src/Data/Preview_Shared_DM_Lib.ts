import { Schema, User_Interaction } from "./Schema"; // Assuming SubSchema is exported from Schema or its own file

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib";

// DM = Data Model

export default class Preview_Shared_DM_Lib extends Base_Generator {
  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.get_shared_data_model_entry();
  }

  get_imports_definitions(): string {
    return `import { Metadata_Object_Base } from "../Shared_Misc/Metadata_Object_Base";
import { Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";
import { SO_Object } from "../Shared_Misc/Sub_Schema";`;
  }

  /**
   * Code for creating object interface
   */

  get_parent_str(): string {
    if (!this.has_parent()) {
      return "";
    }

    let parent_str = `\n${this.tab_indent}parent_id_data: {`;

    this.parent_object_names_list_lower.forEach((x) => {
      parent_str += `\n${this.tab_indent}${this.tab_indent}${x}: string[];`;
    });

    parent_str += `\n${this.tab_indent}};`;

    return parent_str;
  }

  get_child_str(): string {
    if (this.child_property_name_list.length === 0) {
      return "";
    }

    return `\n${this.tab_indent}child_id_data: {${this.child_object_names_list_lower
      .map(
        (x) => `
${this.tab_indent}${this.tab_indent}${x}: {
${this.tab_indent}${this.tab_indent}${this.tab_indent}ids: string[];
${this.tab_indent}${this.tab_indent}${this.tab_indent}start_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}max_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}allow_empty_indexes: false;
${this.tab_indent}${this.tab_indent}};`
      )
      .join("\n")}\n${this.tab_indent}};`;
  }

  get_club_str(): string {
    if (!this.has_club()) {
      return "";
    }

    let club_str = `\n${this.tab_indent}club_id_data: {`;

    this.club_object_names_list_lower.forEach((x) => {
      club_str += `\n${this.tab_indent}${this.tab_indent}${x}: string[];`;
    });

    club_str += `\n${this.tab_indent}};`;

    return club_str;
  }

  get_member_str(): string {
    if (this.member_object_names_list_lower.length === 0) {
      return "";
    }

    // Generate structure similar to get_child_str
    return `\n${this.tab_indent}member_id_data: {${this.member_object_names_list_lower
      .map(
        (x) => `
${this.tab_indent}${this.tab_indent}${x}: {
${this.tab_indent}${this.tab_indent}${this.tab_indent}ids: string[];
${this.tab_indent}${this.tab_indent}${this.tab_indent}start_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}max_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}allow_empty_indexes: false;
${this.tab_indent}${this.tab_indent}};`
      )
      .join("\n")}\n${this.tab_indent}};`;
  }


  get_object_interface(): string {
    return `

// SO = Stateful Object
// SO_[object] holds real information that is manipulated and changed over time.

export interface SO_${this.schema.object_name} extends SO_Object {
${this.tab_indent}${[...this.base_property_name_list, "id"]
      .map((x) => `${x}: string;`)
      .join(`\n${this.tab_indent}`)}${this.get_parent_str()}${this.get_child_str()}${this.get_club_str()}${this.get_member_str()}
}
  `;
  }

  /**
   * End of code for creating object interface
   */

  get_interface_type_section(): string {
    let base_property_list =
      this.base_property_name_list.length == 0 ? "" : "\n" + this.base_property_name_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x}: string;`).join("\n");
    let user_generation: string =
      this.schema.user_interaction_list.length == 0
        ? ""
        : "\n" + this.schema.user_interaction_list.map((x) => `${this.tab_indent}${this.tab_indent}${x.function_name}: string;`).join("\n");

    const template = `
// IMO = Metadata Object
// Interface That Represents the Metadata Object Defined Next.

export interface IMO_${this.schema.object_name} extends Metadata_Object_Base {
  class_name: string;
  parent_class_data: string[];
  child_class_data_list: string[]; // Consider renaming if structure changed (unlikely needed for metadata)
  club_class_data: string[];
  member_class_data_list: string[]; // Consider renaming if structure changed (unlikely needed for metadata)
  functions: {
${this.tab_indent}${this.tab_indent}create_new: string;${base_property_list}${user_generation}
  };
}
`;
    return template;
  }

  get_plain_object_definition(): string {
    const parent_data = this.has_parent()
      ? `,\n${this.tab_indent}parent_class_data: [${this.parent_object_names_list_lower.map((x) => `"${x}"`).join(", ")}]`
      : `,\n${this.tab_indent}parent_class_data: []`;

    const child_object_list =
      this.child_object_names_list_lower.length == 0
        ? ""
        : this.child_object_names_list_lower
            .map((name: string) => {
              return `\"${name}\"`;
            })
            .join(",");
    "\n" + this.tab_indent;

    // club versions
    const club_data = this.has_club()
      ? `,\n${this.tab_indent}club_class_data: [${this.club_object_names_list_lower.map((x) => `"${x}"`).join(", ")}]`
      : `,\n${this.tab_indent}club_class_data: []`;

    const member_object_list =
      this.member_object_names_list_lower.length == 0
        ? ""
        : this.member_object_names_list_lower
            .map((member: string) => {
              // This likely still just needs the name for the metadata list
              return `"${member}"`;
            })
            .join(",");

    const function_list =
      this.base_property_name_list.length == 0
        ? ""
        : "\n" + this.base_property_name_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x}: "ia_set_${this.name_as_lower}_${x}",`).join("\n");
    const user_interaction_function_list =
      this.schema.user_interaction_list.length == 0
        ? ""
        : "\n" +
          this.schema.user_interaction_list
            .map((x) => `${this.tab_indent}${this.tab_indent}${x.function_name}: "ia_${this.name_as_lower}_${x.function_name}",`)
            .join("\n");

    // Note: The MO object definition still lists members as simple strings in `member_class_data_list`.
    // This is probably correct, as this metadata likely just needs the *names* of the related member classes,
    // not their detailed structure definition (which is handled by the SO_ and C_ interfaces).
    return `
// Interface that represents all metadata properties of an object.
// - These properties are all hardcoded and do not change over time.

export const MO_${this.name}: IMO_${this.name} = {
  class_name: \"${this.name_as_lower}\"${parent_data},
  child_class_data_list: [${child_object_list}]${club_data},
  member_class_data_list: [${member_object_list}],
  functions: {
    create_new: "ia_create_new_${this.name_as_lower}",${function_list}${user_interaction_function_list}
  },
};
`;
  }

  /**
   * Start of code for creating 'Create' object interface. 'C_[object]'
   */

  get_create_parent_str(): string {
    if (!this.has_parent()) {
      return "";
    }

    return `\n${this.tab_indent}parent_id_data: {\n${this.parent_object_names_list_lower.map((x) => `${this.tab_indent}${this.tab_indent}${x}: string[];`).join("\n")}\n${
      this.tab_indent
    }};`;
  }

  get_create_child_str(): string {
    if (this.child_object_names_list_lower.length === 0) {
      return "";
    }

    // Must be '?' to support front to back-end ia interaction.
    return `\n${this.tab_indent}child_id_data?: {${this.child_object_names_list_lower
      .map(
        (x) => `
${this.tab_indent}${this.tab_indent}${x}: {
${this.tab_indent}${this.tab_indent}${this.tab_indent}ids: string[];
${this.tab_indent}${this.tab_indent}${this.tab_indent}start_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}max_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}allow_empty_indexes: false;
${this.tab_indent}${this.tab_indent}};`
      )
      .join("\n")}\n${this.tab_indent}};`;
  }

  get_create_club_str(): string {
    if (!this.has_club()) {
      return "";
    }

    // Must be '?' to support front to back-end ia interaction.
    return `\n${this.tab_indent}club_id_data?: {\n${this.club_object_names_list_lower.map((x) => `${this.tab_indent}${this.tab_indent}${x}: string[];`).join("\n")}\n${
      this.tab_indent
    }};`;
  }

  // ***** UPDATED METHOD *****
  get_create_member_str(): string {
    if (this.member_object_names_list_lower.length === 0) {
      return "";
    }

    // Generate structure similar to get_create_child_str, including the optional '?'
    // Must be '?' to support front to back-end ia interaction.
    return `\n${this.tab_indent}member_id_data?: {${this.member_object_names_list_lower
      .map(
        (x) => `
${this.tab_indent}${this.tab_indent}${x}: {
${this.tab_indent}${this.tab_indent}${this.tab_indent}ids: string[];
${this.tab_indent}${this.tab_indent}${this.tab_indent}start_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}max_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}allow_empty_indexes: false;
${this.tab_indent}${this.tab_indent}};` // Note: Added semicolon inside generated block
      )
      .join("\n")}\n${this.tab_indent}};`;
  }
  // ***** END OF UPDATED METHOD *****


  get_create_object_interface(): string {
    return `
// C = Create
// Interface for object creation.

export interface C_${this.schema.object_name} {
${this.tab_indent}${[...this.base_property_name_list, "id"]
      .map((x) => `${x}?: string;`)
      .join(`\n${this.tab_indent}`)}${this.get_create_parent_str()}${this.get_create_child_str()}${this.get_create_club_str()}${this.get_create_member_str()} // Uses updated get_create_member_str
}`;
  }

  /**
   * End of code for creating 'Create' object interface. 'C_[object]'
   */

  generate_ia_interfaces() {
    let parent_schema = this.has_parent() ? this.parent_object_names_list_lower.map((x) => `\n${this.tab_indent}${x.toLocaleLowerCase()}_ids: string[];`).join("") : "";
    let data_model_entry = `

// Interface Argument(s) - Back-End Function Interfaces.
`;

    // Add interface (always the same)
    data_model_entry += `
export interface IA_create_new_${this.name_as_lower} extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;${parent_schema}
}
`;

    // Dynamically generate set interfaces.
    this.base_property_name_list.forEach((property) => {
      data_model_entry += `
export interface IA_set_${this.name_as_lower}_${property} extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  ${this.name_as_lower}_id: string;
  new_${property}: string;
}
`;
    });

    return data_model_entry;
  }

  generation_ia_user_interaction_interfaces() {
    let tab_indent = this.tab_indent;

    function get_user_interaction_object_line(object: string) {
      return object === "" ? "" : `\n${tab_indent}${object}_id: string;`;
    }

    return this.schema.user_interaction_list
      .map((user_interaction: User_Interaction) => {
        return `
export interface IA_${this.name_as_lower}_${user_interaction.function_name} extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;${get_user_interaction_object_line(user_interaction.object_1)}${get_user_interaction_object_line(user_interaction.object_2)}
}`;
      })
      .join("\n");
  }

  // Shared data model entry first
  get_shared_data_model_entry() {
    let data_model_entry = "";

    // Create imports first
    data_model_entry += this.get_imports_definitions(); // Works

    // Interface Objects
    data_model_entry += this.get_object_interface();

    // Add Interface Type
    data_model_entry += this.get_interface_type_section(); // Works

    // Plain Object Definition
    data_model_entry += this.get_plain_object_definition();

    // Add Object Creation Interface
    data_model_entry += this.get_create_object_interface();

    // IAs
    data_model_entry += this.generate_ia_interfaces();

    // IA User Interactions
    data_model_entry += this.generation_ia_user_interaction_interfaces();

    this.final_content = data_model_entry;
  }
}