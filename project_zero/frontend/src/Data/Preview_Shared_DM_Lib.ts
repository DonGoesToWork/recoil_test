import { Schema, User_Interaction } from "./Schema";

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib";

export default class Preview_Shared_DM_Lib extends Base_Generator {
  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.get_shared_data_model_entry();
  }

  get_imports_definitions(): string {
    return `import { Group_Class_Data, Group_Container_Class_Data, Metadata_Object_Base } from "../Shared_Misc/Metadata_Object_Base";
import { Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";`;
  }

  /**
   * Code for creating object interface
   */

  get_parent_str(): string {
    if (!this.has_parent()) {
      return "";
    }

    let parent_str = `\n${this.tab_indent}parent_data: {`;

    this.schema.parent_object_names_list.forEach((x) => {
      parent_str += `\n${this.tab_indent}${this.tab_indent}${x.toLocaleLowerCase()}_id: string;`;
    });

    parent_str += `\n${this.tab_indent}}`;

    return parent_str;
  }

  get_child_str(): string {
    if (this.child_property_name_list.length === 0) {
      return "";
    }

    return `\n${this.tab_indent}child_data: {${this.child_property_name_list
      .map(
        (x) => `
${this.tab_indent}${this.tab_indent}${x}: {
${this.tab_indent}${this.tab_indent}${this.tab_indent}ids: string[];
${this.tab_indent}${this.tab_indent}${this.tab_indent}start_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}max_size: number;
${this.tab_indent}${this.tab_indent}${this.tab_indent}allow_empty_indexes: false;
${this.tab_indent}${this.tab_indent}};`
      )
      .join("\n")}\n${this.tab_indent}}`;
  }

  get_club_str(): string {
    if (!this.has_club()) {
      return "";
    }

    let club_str = `\n${this.tab_indent}club_data: {`;

    this.schema.club_object_names_list.forEach((x) => {
      club_str += `\n${this.tab_indent}${this.tab_indent}${x.toLocaleLowerCase()}_id: string;`;
    });

    club_str += `\n${this.tab_indent}}`;

    return club_str;
  }

  get_member_str(): string {
    if (this.schema.member_object_names_list.length === 0) {
      return "";
    }

    let member_str = `\n${this.tab_indent}member_data: {`;

    this.schema.member_object_names_list.forEach((x) => {
      member_str += `\n${this.tab_indent}${this.tab_indent}${x.toLocaleLowerCase()}_id: string;`;
    });

    member_str += `\n${this.tab_indent}}`;

    return member_str;
  }

  get_object_interface(): string {
    return `
  
  // SO = Stateful Object
  // SO_[object] holds real information that is manipulated and changed over time.
  
  export interface SO_${this.schema.object_name} {
${this.tab_indent}${[...this.base_property_name_list, "id"].map((x) => `${x}: string;`).join(`\n${this.tab_indent}`)}${this.get_parent_str()}${this.get_child_str()}${this.get_club_str()}${this.get_member_str()}
}
  `;
  }

  /**
   * End of code for creating object interface
   */

  get_interface_type_section(): string {
    let base_property_list = this.base_property_name_list.length == 0 ? "" : "\n" + this.base_property_name_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x}: string;`).join("\n");
    let user_generation: string = this.schema.user_interaction_list.length == 0 ? "" : "\n" + this.schema.user_interaction_list.map((x) => `${this.tab_indent}${this.tab_indent}${x.function_name}: string;`).join("\n");

    const template = `
// IMO = Metadata Object
// Interface That Represents the Metadata Object Defined Next.

export interface IMO_${this.schema.object_name} extends Metadata_Object_Base {
  class_name: string;
  parent_data: Group_Container_Class_Data;
  child_class_data_list: Group_Class_Data[];
  club_class_data_list: Group_Container_Class_Data;
  member_class_data_list: Group_Class_Data[];
  functions: {
${this.tab_indent}${this.tab_indent}create_new: string;${base_property_list}${user_generation}
  };
}
`;
    return template;
  }

  get_plain_object_definition(): string {
    const parent_data = this.has_parent()
      ? `,\n${this.tab_indent}parent_data: {
    class_names: [${this.schema.parent_object_names_list.map((x) => `"${x}"`).join(", ")}], 
    id_list_name: "${this.name}_ids",
  }`
      : `,\n${this.tab_indent}parent_data: null`;

    const child_object_list =
      this.child_property_name_list.length == 0
        ? ""
        : "\n" +
          this.child_property_name_list
            .map((child: string, i: number) => {
              return `${this.tab_indent}${this.tab_indent}{
      class_name: \"${this.child_property_list[i].name}\",
      id_list_name: \"${child}\",
    },`;
            })
            .join("\n") +
          "\n" +
          this.tab_indent;

    // club versions
    const club_data = this.has_club()
      ? `,\n${this.tab_indent}club_class_data_list: {
    class_names: [${this.schema.club_object_names_list.map((x) => `"${x}"`).join(", ")}], 
    id_list_name: "${this.name}_ids",
  }`
      : `,\n${this.tab_indent}club_class_data_list: null`;

    const member_object_list =
      this.schema.member_object_names_list.length == 0
        ? ""
        : "\n" +
          this.schema.member_object_names_list
            .map((child: string) => {
              return `${this.tab_indent}${this.tab_indent}{
      class_name: \"${child}\",
      id_list_name: \"${child}_ids\",
    },`;
            })
            .join("\n") +
          "\n" +
          this.tab_indent;

    const function_list = this.base_property_name_list.length == 0 ? "" : "\n" + this.base_property_name_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x}: "ia_set_${this.name_as_lower}_${x}",`).join("\n");
    const user_interaction_function_list = this.schema.user_interaction_list.length == 0 ? "" : "\n" + this.schema.user_interaction_list.map((x) => `${this.tab_indent}${this.tab_indent}${x.function_name}: "ia_${this.name_as_lower}_${x.function_name}",`).join("\n");

    return `
// Interface that represents all metadata properties of an object.
// - These properties are all hardcoded and do not change over time.

export const MO_${this.name}: IMO_${this.name} = {
  class_name: \"${this.schema.object_name}\"${parent_data},
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

    return `\n${this.tab_indent}parent_data: {
${this.tab_indent}${this.tab_indent}player_id: string;
${this.tab_indent}};`;
  }

  get_create_child_str(): string {
    if (this.child_property_name_list.length === 0) {
      return "";
    }

    return `\n${this.tab_indent}child_data?: {${this.child_property_name_list
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

    return `\n${this.tab_indent}club_data?: {
${this.tab_indent}${this.tab_indent}guild_id: string;
${this.tab_indent}${this.tab_indent}player_inventory_id: string;
${this.tab_indent}${this.tab_indent}entity_inventory_id: string;
${this.tab_indent}};`;
  }

  get_create_member_str(): string {
    if (this.schema.member_object_names_list.length === 0) {
      return "";
    }

    return `\n${this.tab_indent}member_data?: {${this.schema.member_object_names_list
      .map(
        (x) => `
  ${this.tab_indent}${this.tab_indent}${x.toLocaleLowerCase()}_id: string;`
      )
      .join("\n")}\n${this.tab_indent}};`;
  }

  get_create_object_interface(): string {
    return `
  // C = Create
  // Interface for object creation.
  
  export interface C_${this.schema.object_name} {
${this.tab_indent}${[...this.base_property_name_list, "id"].map((x) => `${x}?: string;`).join(`\n${this.tab_indent}`)}${this.get_create_parent_str()}${this.get_create_child_str()}${this.get_create_club_str()}${this.get_create_member_str()}
}`;
  }

  /**
   * End of code for creating 'Create' object interface. 'C_[object]'
   */

  generate_ia_interfaces() {
    let parent_schema = this.has_parent() ? `\n${this.tab_indent}parent_id: string;\n${this.tab_indent}parent_class_name: string;` : "";
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
