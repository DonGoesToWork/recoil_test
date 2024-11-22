import { Schema, Schema_Property, User_Interaction } from "./Schema";

import Base_Generator from "./Base_Generator";

export default class Preview_Back_DM_Lib extends Base_Generator {
  final_content: string = "";

  constructor(schema: Schema) {
    super(schema);
    this.generate_backend_action_functions();
  }

  get_import_statements(): string {
    const { object_name } = this.schema;
    const imports = [
      ...this.schema.user_interaction_list.map((user_interaction: User_Interaction) => `IA_${this.name_as_lower}_${user_interaction.function_name}`),
      `IA_${this.name_as_lower}_create_new`,
      ...this.base_property_name_list.map((property) => `IA_${this.name_as_lower}_set_${property.toLocaleLowerCase()}`),
    ].join(", ");

    return `import { ${imports}, IO_${object_name}, IS_${object_name}, ${object_name} } from "../Shared_Data_Models/${object_name}";
import { Payload_Add, Payload_Set, Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";
import Backend_State from "../../static_internal_logic/Backend_State";
import { Object_Class_Function_Map } from "../Object_Registration/Object_Registration";
import { generate_unique_id } from "../../utils/utils";
${this.schema.user_interaction_list.map((user_interaction: User_Interaction) => `import { iam_${this.name_as_lower}_${user_interaction.function_name} } from "../../Interactions/${this.name}";`).join("\n")}
`;
  }

  generate_initialize_object_function(): string {
    const { object_name } = this.schema;

    const base_prop_default_values = this.base_property_list.length ? this.base_property_list.map((prop) => `${prop.default_value}`) : [];
    const base_props = this.base_property_name_list.length ? this.base_property_name_list.map((prop, i) => `${prop}: ${this.name_as_lower}.${prop} ?? "${base_prop_default_values[i]}"`) : [];

    const child_props = this.child_property_list.length ? this.child_property_list.map((prop) => `${prop.name.toLocaleLowerCase()}_ids: { ids: [], start_size: ${prop.id_list_start_size}, max_size: ${prop.id_list_max_size}, allow_empty_indexes: ${prop.id_list_allow_empty_indexes} }`) : [];
    const combined_props = [...base_props, ...child_props].join(`,\n${this.tab_indent}`);
    const parent_id = this.has_parent() ? `parent_id: ${this.name_as_lower}.parent_id,` : "";

    return `const initialize_${this.name_as_lower} = (${this.name_as_lower}: IS_${object_name}): IO_${object_name} => ({
  id: generate_unique_id(),${combined_props ? `\n${this.tab_indent}${combined_props},` : ""}${parent_id ? `\n${this.tab_indent}${parent_id}` : ""}
});
`;
  }

  generate_add_function(): string {
    const { object_name } = this.schema;

    return `export let create_new_${this.name_as_lower} = (state: Backend_State, ${this.name_as_lower}: IS_${object_name}, _func_callback?: (state: Backend_State, new_${this.name_as_lower}: IO_${object_name}) => void): void => {
  const new_${this.name_as_lower} = initialize_${this.name_as_lower}(${this.name_as_lower});
  if (_func_callback) _func_callback(state, new_${this.name_as_lower});
  const payload: Payload_Add = { objectType: ${object_name}.class_name, object: new_${this.name_as_lower} };
  state.add(payload);
};
`;
  }

  generate_ia_add_function(): string {
    const { object_name } = this.schema;
    const parent_id = this.has_parent() ? `parent_id: data.parent_id` : "";

    return this.schema.do_gen_ia_create_new
      ? `let ia_create_new_${this.name_as_lower} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_${this.name_as_lower}_create_new;
  const new_${this.name_as_lower}: IS_${object_name} = { ${parent_id} };
  create_new_${this.name_as_lower}(state, new_${this.name_as_lower});
};
`
      : "";
  }

  generate_create_set_payload_function(): string {
    return `const create_set_payload = (objectType: string, id: string, propertyName: string, propertyValue: string): Payload_Set => ({ objectType, id, propertyName, propertyValue });\n`;
  }

  generate_set_property_function(): string {
    return `const set_${this.name_as_lower}_property = (state: Backend_State, ${this.name_as_lower}_id: string, propertyName: string, propertyValue: string): void => {
  const payload = create_set_payload(${this.schema.object_name}.class_name, ${this.name_as_lower}_id, propertyName, propertyValue);
  state.set(payload);
};
`;
  }

  generate_set_functions(): string {
    const { object_name } = this.schema;
    return this.base_property_list
      .map((schema_property: Schema_Property) => {
        const lowerCaseProperty = schema_property.name.toLowerCase();
        return `export let set_${this.name_as_lower}_${lowerCaseProperty} = (state: Backend_State, ${this.name_as_lower}_id: string, new_${lowerCaseProperty}: string): void => {
  set_${this.name_as_lower}_property(state, ${this.name_as_lower}_id, ${object_name}.properties.${lowerCaseProperty}, new_${lowerCaseProperty});
};
${
  schema_property.do_gen_ia_set
    ? `
let ia_set_${this.name_as_lower}_${lowerCaseProperty} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_${this.name_as_lower}_set_${lowerCaseProperty};
  set_${this.name_as_lower}_${lowerCaseProperty}(state, data.${this.name_as_lower}_id, data.new_${lowerCaseProperty});
};
`
    : ""
}`;
      })
      .join("\n");
  }

  generate_ia_user_interaction_functions(): string {
    return this.schema.user_interaction_list
      .map((user_interaction: User_Interaction) => {
        return `let ia_${this.name_as_lower}_${user_interaction.function_name.toLowerCase()} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_${this.name_as_lower}_${user_interaction.function_name};
  iam_${this.name_as_lower}_${user_interaction.function_name}(state, data);
};
`;
      })
      .join("\n");
  }

  generate_backend_switch_function(): string {
    const { object_name } = this.schema;
    const switch_statements = [
      `x['${object_name}'] = {};`,
      `x['${object_name}']['ia_${this.name_as_lower}_create_new'] = ia_create_new_${this.name_as_lower};`,
      ...this.base_property_name_list.map((property) => `x['${object_name}']['ia_set_${this.name_as_lower}_${property.toLowerCase()}'] = ia_set_${this.name_as_lower}_${property.toLowerCase()};`),
      ...this.schema.user_interaction_list.map((user_interaction) => `x['${object_name}']['ia_${this.name_as_lower}_${user_interaction.function_name.toLowerCase()}'] = ia_${this.name_as_lower}_${user_interaction.function_name.toLowerCase()};`),
    ].join("\n  ");

    return `export let Register_${object_name} = (x: Object_Class_Function_Map): void => {
  ${switch_statements}
};
`;
  }

  generate_backend_action_functions(): void {
    this.final_content = `${this.get_import_statements()}
${this.generate_create_set_payload_function()}
${this.generate_set_property_function()}
${this.generate_initialize_object_function()}
${this.generate_add_function()}
${this.generate_ia_add_function()}
${this.generate_set_functions()}
${this.generate_ia_user_interaction_functions()}
${this.generate_backend_switch_function()}`;
  }
}
