import Base_Generator from "./BaseGenerator";
import { Schema } from "./Schema";

export default class Preview_Shared_DM_Lib extends Base_Generator {
  constructor(schema: Schema) {
    super(schema);
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
    class_name: string;
    id_list_name: string;
  } | null;
  child_class_data_list: Child_Class_Data[];
  properties: {
${this.combined_property_list_no_children.map((x) => `${this.tab_indent}${this.tab_indent}${x.toLocaleLowerCase()}: string;`).join("\n")}
  };
  functions: {
${this.tab_indent}${this.tab_indent}create_new: string;
${this.base_property_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x.toLocaleLowerCase()}: string;`).join("\n")}
  };
}
`;
    return template;
  }

  get_plain_object_definition(): string {
    const schemaTitle = this.schema.object_name;
    const childClassNames: string[] = this.schema.child_list.split(this.delimeter_child_split).filter((x) => x !== "");

    const childObjectList =
      childClassNames.length == 0
        ? ""
        : "\n" +
          childClassNames
            .map((child: string) => {
              return `${this.tab_indent}${this.tab_indent}{
      class_name: \"${child}\",
      id_list_name: \"${child.toLocaleLowerCase()}_ids\",
    },`;
            })
            .join("\n") +
          "\n" +
          this.tab_indent;

    const objectFunctionList = this.combined_property_list_no_children.map((x) => `${this.tab_indent}${this.tab_indent}${x.toLocaleLowerCase()}: "${x.toLocaleLowerCase()}",`).join("\n");
    const functionList = this.base_property_list.map((x) => `${this.tab_indent}${this.tab_indent}set_${x.toLocaleLowerCase()}: "ia_set_${this.name_as_lower}_${x.toLocaleLowerCase()}",`).join("\n");

    const parent_data = this.has_parent()
      ? `,\n${this.tab_indent}parent_data: {
    class_name: \"${this.schema.parent}\",
    id_list_name: "${schemaTitle.toLocaleLowerCase()}_ids",
  }`
      : `,\n${this.tab_indent}parent_data: null`;

    return `
// Complete Class Definition w/ Full Metadata.

export const ${schemaTitle}: IT_${schemaTitle} = {
  class_name: \"${this.schema.object_name}\"${parent_data},
  child_class_data_list: [${childObjectList}],
  properties: {
${objectFunctionList}
  },
  functions: {
    create_new: "ia_${schemaTitle.toLocaleLowerCase()}_create_new",
${functionList}
  },
};
`;
  }

  get_object_interface() {
    let child_str =
      this.child_property_list.length == 0
        ? ""
        : `\n${this.child_property_list
            .map(
              (x) => `${this.tab_indent}${x.toLocaleLowerCase()}: {
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
  ${this.add_parent_id([...this.base_property_list, "id"])
    .map((x) => `${x.toLocaleLowerCase()}: string;`)
    .join(`\n${this.tab_indent}`)}${child_str}
}
`;
  }

  get_create_object_interface() {
    let parent_str = this.has_parent() ? `\n${this.tab_indent}parent_id: string;` : "";

    return `
// Class Definition for Object Creation

export interface IS_${this.schema.object_name} {
  ${[...this.base_property_list, "id"].map((x) => `${x.toLocaleLowerCase()}?: string;`).join(`\n${this.tab_indent}`)}${parent_str}
}`;
  }

  get_interfaces_for_i_as() {
    let parent_schema = this.has_parent() ? `\n${this.tab_indent}parent_id: string;` : "";
    let dataModelEntry = `

// Interface Argument(s) - Back-End Function Interfaces.
`;

    // Add interface (always the same)
    dataModelEntry += `
export interface IA_${this.name_as_lower}_create_new extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;${parent_schema}
}
`;

    // Dynamically generate set interfaces.
    this.base_property_list.forEach((property) => {
      dataModelEntry += `
export interface IA_${this.name_as_lower}_set_${property.toLocaleLowerCase()} extends Pre_Message_Action_Send {
  object_class: string;
  function_name: string;
  ${this.name_as_lower}_id: string;
  new_${property.toLocaleLowerCase()}: string;
}
`;
    });

    return dataModelEntry;
  }

  // Shared data model entry first
  get_shared_data_model_entry() {
    let dataModelEntry = "";

    // Create imports first
    dataModelEntry += this.get_imports_definitions(); // Works

    // Add Interface Type
    dataModelEntry += this.get_interface_type_section(); // Works

    // Plain Object Definition
    dataModelEntry += this.get_plain_object_definition();

    // Interface Objects
    dataModelEntry += this.get_object_interface();

    // Add Object Creation Interface
    dataModelEntry += this.get_create_object_interface();

    // IAs
    dataModelEntry += this.get_interfaces_for_i_as();

    this.final_content = dataModelEntry;
  }
}