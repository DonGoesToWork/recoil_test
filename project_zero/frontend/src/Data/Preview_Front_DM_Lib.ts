import { Schema, User_Interaction } from "./Schema";

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib";

export default class Preview_Front_DM_Lib extends Base_Generator {
  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.generate_action_functions();
  }

  get_import_statements(): string {
    let interface_imports = [
      ...this.schema.user_interaction_list.map((user_interaction: User_Interaction) => `IA_${this.name_as_lower}_${user_interaction.function_name}`),
      `IA_${this.name_as_lower}_create_new`,
      ...this.base_property_name_list.map((property) => `IA_${this.name_as_lower}_set_${property}`),
    ].join(", ");

    return `import { ${this.schema.object_name}, ${interface_imports} } from "../Shared_Data_Models/${this.schema.object_name}";

import { GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT } from "../../utils/IA_Remove";
import { I_Message_Sender } from "../../utils/I_Message_Sender";
`;
  }

  // Front-End - generate_add_function() - We only pass the 'user_input' properties to the back-end and let it generate the rest.
  generate_add_function(): string {
    let parent_arg = "";
    let parent_schema = "";
    let input_args = "";
    let parent_as_lower = "";
    let full_str = "";

    // be careful with this method if you decide to use it, objects without parents must be manually managed!
    if (this.schema.parent_object_names_list.length == 0) {
      return `
export let create_new_${this.name_as_lower}_wo_parent = (function_send_message: Function${input_args}): void => {
  let data: IA_${this.name_as_lower}_create_new = {
    object_class: ${this.name}.class_name,
    function_name: ${this.name}.functions.create_new,
  };

  function_send_message(data);
};
      `;
    } else {
      full_str += `
export let create_new_${this.name_as_lower}_wo_parent = (function_send_message: Function${input_args}): void => {
  let data: IA_${this.name_as_lower}_create_new = {
    object_class: ${this.name}.class_name,
    function_name: ${this.name}.functions.create_new,
    parent_id: "",
    parent_class_name: ""
  };

  function_send_message(data);
};
      `;
    }

    this.schema.parent_object_names_list.forEach((parent: string) => {
      parent_as_lower = parent.toLocaleLowerCase();

      parent_arg = `, ${parent_as_lower}_id: string`;
      parent_schema = `,\n${this.tab_indent}${this.tab_indent}parent_id: ${parent_as_lower}_id,` + `\n${this.tab_indent}${this.tab_indent}parent_class_name: "${parent}"`;

      full_str += `
export let create_new_${this.name_as_lower}_w_parent_${parent_as_lower} = (function_send_message: Function${input_args}${parent_arg}): void => {
  let data: IA_${this.name_as_lower}_create_new = {
    object_class: ${this.name}.class_name,
    function_name: ${this.name}.functions.create_new${parent_schema}    
  };

  function_send_message(data);
};
`;
    });

    return full_str;
  }

  generate_remove_function(): string {
    let object_id_arg = (this.schema.object_name + "_id").toLocaleLowerCase();

    return `
export let remove_${this.name_as_lower} = (function_send_message: I_Message_Sender, ${object_id_arg}: string): void => {
  function_send_message(GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(${this.schema.object_name}.class_name, ${object_id_arg}));
};
`;
  }

  generate_set_functions(): string {
    return this.base_property_list
      .map((schema_property) => {
        const property = schema_property.name.toLowerCase();
        const setFunction = `
export let set_${this.name_as_lower}_${property} = (function_send_message: Function, ${this.name_as_lower}_id: string, new_${property}: string): void => {
  let data: IA_${this.name_as_lower}_set_${property} = {
    object_class: ${this.schema.object_name}.class_name,
    function_name: ${this.schema.object_name}.functions.set_${property},
    ${this.name_as_lower}_id: ${this.name_as_lower}_id,
    new_${property}: new_${property},
  };
  function_send_message(data);
};
`;
        return schema_property.do_gen_ia_set ? setFunction : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  get_interaction_functions(): string {
    let tab_indent = this.tab_indent;

    function get_user_interaction_object_line(object: string) {
      return object === "" ? "" : `\n${tab_indent}${tab_indent}${object}_id: ${object}_id,`;
    }

    return this.schema.user_interaction_list
      .map((user_interaction) => {
        return `
export let ${this.name_as_lower}_${user_interaction.function_name} = (function_send_message: Function, ${user_interaction.object_1.toLocaleLowerCase()}_id: string, ${user_interaction.object_2.toLocaleLowerCase()}_id: string): void => {
  let data: IA_${this.name_as_lower}_${user_interaction.function_name} = {
    object_class: "${this.name}",
    function_name: "${user_interaction.function_name}",${get_user_interaction_object_line(user_interaction.object_1)}${get_user_interaction_object_line(user_interaction.object_2)}
  };
  function_send_message(data);
};
`;
      })
      .join("\n");
  }

  generate_action_functions() {
    let content = "";

    // Generate import statements
    content += this.get_import_statements();

    // Generate add function
    content += this.generate_add_function();

    // Generate remove function
    content += this.generate_remove_function();

    // Generate set functions
    content += this.generate_set_functions();

    // Generate interaction functions
    content += this.get_interaction_functions();

    this.final_content = content;
  }
}
