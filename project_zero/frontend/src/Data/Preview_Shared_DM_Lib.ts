import { Schema, User_Interaction } from "./Schema";

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib";

export default class Preview_Shared_DM_Lib extends Base_Generator {
  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.get_shared_data_model_entry();
  }

  get_imports_definitions(): string {
    return `import { Child_Class_Data, Data_Model_Base } from "../Shared_Misc/Data_Model_Base";
import { Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";`;
  }

  get_interface_type_section(): string {
    const template = `

// AUTO-GENERATED: This entire file was generated by the auto-generator tool.

// Interface (Type) for Complete Class Definition w/ Full Metadata.

export interface IT_${this.schema.object_name} extends Data_Model_Base {
  class_name: string;
  parent_data: {
    class_names: string[];
    id_list_name: string;
  } | null;
  child_class_data_list: Child_Class_Data[];
  properties: {
${this.combined_property_list_no_children.map((x) => `${this.tab_indent}${this.tab_indent}${x}: string;`).join("\n")}
  };
  functions: {
${this.tab_indent}${this.tab_indent}create_new: string;
${this.base_property_name_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x}: string;`).join("\n")}
  };
}
`;
    return template;
  }

  get_plain_object_definition(): string {
    const schema_title = this.schema.object_name;

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

    const object_function_list = this.combined_property_list_no_children.map((x) => `${this.tab_indent}${this.tab_indent}${x}: "${x}",`).join("\n");
    const function_list = this.base_property_name_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x}: "ia_set_${this.name_as_lower}_${x}",`).join("\n");

    const parent_data = this.has_parent()
      ? `,\n${this.tab_indent}parent_data: {
    class_names: [${this.schema.parent_object_names_list.map((x) => `"${x}"`).join(", ")}], 
    id_list_name: "${schema_title}_ids",
  }`
      : `,\n${this.tab_indent}parent_data: null`;

    return `
// Complete Class Definition w/ Full Metadata.

export const ${schema_title}: IT_${schema_title} = {
  class_name: \"${this.schema.object_name}\"${parent_data},
  child_class_data_list: [${child_object_list}],
  properties: {
${object_function_list}
  },
  functions: {
    create_new: "ia_${schema_title}_create_new",
${function_list}
  },
};
`;
  }

  get_object_interface() {
    let child_str =
      this.child_property_name_list.length == 0
        ? ""
        : `\n${this.child_property_name_list
            .map(
              (x) => `${this.tab_indent}${x}: {
    ids: string[];
    start_size: number;
    max_size: number;
    allow_empty_indexes: false;
  };`
            )
            .join("\n")}`;

    return `
// Class Definition w/o Metadata Properties or Methods

export interface IO_${this.schema.object_name} {
  ${this.add_parent_id([...this.base_property_name_list, "id"])
    .map((x) => `${x}: string;`)
    .join(`\n${this.tab_indent}`)}${child_str}
}
`;
  }

  get_create_object_interface() {
    let parent_str = this.has_parent() ? `\n${this.tab_indent}parent_id: string;\n${this.tab_indent}parent_class_name: string;` : "";

    return `
// Class Definition for Object Creation

export interface IS_${this.schema.object_name} {
  ${[...this.base_property_name_list, "id"].map((x) => `${x}?: string;`).join(`\n${this.tab_indent}`)}${parent_str}
}`;
  }

  generate_ia_interfaces() {
    let parent_schema = this.has_parent() ? `\n${this.tab_indent}parent_id: string;\n${this.tab_indent}parent_class_name: string;` : "";
    let data_model_entry = `

// Interface Argument(s) - Back-End Function Interfaces.
`;

    // Add interface (always the same)
    data_model_entry += `
export interface IA_${this.name_as_lower}_create_new extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;${parent_schema}
}
`;

    // Dynamically generate set interfaces.
    this.base_property_name_list.forEach((property) => {
      data_model_entry += `
export interface IA_${this.name_as_lower}_set_${property} extends Pre_Message_Action_Send {
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

    // Add Interface Type
    data_model_entry += this.get_interface_type_section(); // Works

    // Plain Object Definition
    data_model_entry += this.get_plain_object_definition();

    // Interface Objects
    data_model_entry += this.get_object_interface();

    // Add Object Creation Interface
    data_model_entry += this.get_create_object_interface();

    // IAs
    data_model_entry += this.generate_ia_interfaces();

    // IA User Interactions
    data_model_entry += this.generation_ia_user_interaction_interfaces();

    this.final_content = data_model_entry;
  }
}
