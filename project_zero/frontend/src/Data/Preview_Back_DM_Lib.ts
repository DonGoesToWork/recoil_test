import { Schema, Schema_Property, User_Interaction } from "./Schema";

import Base_Generator from "./Base_Generator";
import { fix_schema } from "./Schema_Lib";

export default class Preview_Back_DM_Lib extends Base_Generator {
  final_content: string = "";

  constructor(schema: Schema, schemas: Schema[], do_fix_schemas: boolean) {
    super(do_fix_schemas ? fix_schema(schema, schemas, true) : schema);
    this.generate_backend_action_functions();
  }

  get_import_statements(): string {
    const { object_name } = this.schema;
    const imports = [
      ...this.schema.user_interaction_list.map((user_interaction: User_Interaction) => `IA_${this.name_as_lower}_${user_interaction.function_name}`),
      `IA_create_new_${this.name_as_lower}`,
      ...this.base_property_name_list.map((property) => `IA_set_${this.name_as_lower}_${property}`),
    ].join(", ");

    return `import { ${imports}, SO_${object_name}, C_${object_name}, MO_${object_name} } from "../Shared_Data_Models/${object_name}";
import { Payload_Add, Payload_Set, Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";
import Backend_State from "../../static_internal_logic/Backend_State";
import { Object_Class_Function_Map } from "../Data_Registration/Object_Registration";
import { generate_unique_id } from "../../utils/utils";
${this.schema.user_interaction_list.map((user_interaction: User_Interaction) => `import { iam_${this.name_as_lower}_${user_interaction.function_name} } from "../../Interactions/${this.name}";`).join("\n")}
`;
  }

  /**
   * Start of code for initialize object functions.
   */

  generate_initialize_object_function(): string {
    const { object_name } = this.schema;

    // Base properties
    const base_prop_default_values = this.base_property_list.map((prop) => `${prop.default_value}`);
    const base_props = this.base_property_name_list.map((prop, i) => `${prop}: ${this.name_as_lower}.${prop} ?? "${base_prop_default_values[i]}"`);

    // Parent Data
    const parent_data = this.has_parent()
      ? `parent_data: {${this.schema.parent_object_names_list
          .map(
            (parent) => `
${this.tab_indent}${this.tab_indent}${parent.toLocaleLowerCase()}_id: "",`
          )
          .join("")}
${this.tab_indent}}`
      : "";

    // Child Data
    const child_data = this.child_property_list.length
      ? `child_data: {${this.child_property_list
          .map(
            (child) => `
${this.tab_indent}${this.tab_indent}${child.name.toLocaleLowerCase()}_ids: {
${this.tab_indent}${this.tab_indent}${this.tab_indent}ids: [],
${this.tab_indent}${this.tab_indent}${this.tab_indent}start_size: ${child.id_list_start_size},
${this.tab_indent}${this.tab_indent}${this.tab_indent}max_size: ${child.id_list_max_size},
${this.tab_indent}${this.tab_indent}${this.tab_indent}allow_empty_indexes: ${child.id_list_allow_empty_indexes}
${this.tab_indent}${this.tab_indent}},`
          )
          .join("")}
${this.tab_indent}}`
      : "";

    // Club Data
    const club_data = this.has_club()
      ? `club_data: {${this.schema.club_object_names_list
          .map(
            (club) => `
${this.tab_indent}${this.tab_indent}${club.toLocaleLowerCase()}_id: "",`
          )
          .join("")}
${this.tab_indent}}`
      : "";

    // Member Data
    const member_data = this.schema.member_object_names_list.length
      ? `member_data: {${this.schema.member_object_names_list
          .map(
            (member) => `
${this.tab_indent}${this.tab_indent}${member.toLocaleLowerCase()}_id: "",`
          )
          .join("")}
${this.tab_indent}}`
      : "";

    // Combine all properties
    const combined_props = [...base_props, parent_data, child_data, club_data, member_data]
      .filter((prop) => prop) // Remove empty properties
      .join(`,\n${this.tab_indent}`);

    return `const initialize_${this.name_as_lower} = (${this.name_as_lower}: C_${object_name}): SO_${object_name} => ({
  id: generate_unique_id(),
  ${combined_props}
});
`;
  }

  /**
   * End of code for initialize object functions.
   */

  generate_add_function(): string {
    const { object_name } = this.schema;

    return `export let create_new_${this.name_as_lower} = (state: Backend_State, ${this.name_as_lower}: C_${object_name}, _func_callback?: (state: Backend_State, new_${this.name_as_lower}: SO_${object_name}) => void): void => {
  const new_${this.name_as_lower} = initialize_${this.name_as_lower}(${this.name_as_lower});
  if (_func_callback) _func_callback(state, new_${this.name_as_lower});
  const payload: Payload_Add = { object_type: MO_${object_name}.class_name, object: new_${this.name_as_lower} };
  state.add(payload);
};
`;
  }

  generate_ia_add_function(): string {
    const { object_name } = this.schema;

    const parent_data = this.has_parent()
      ? `${this.tab_indent}parent_data: {${this.schema.parent_object_names_list
          .map(
            (parent) => `
  ${this.tab_indent}${this.tab_indent}${parent.toLocaleLowerCase()}_id: data.parent_id,`
          )
          .join("")}
  ${this.tab_indent}},`
      : "";

    return this.schema.do_gen_ia_create_new
      ? `let ia_create_new_${this.name_as_lower} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_create_new_${this.name_as_lower};
  const new_${this.name_as_lower}: C_${object_name} = {${parent_data ? `\n${this.tab_indent}${parent_data}` : ""}
  };
  create_new_${this.name_as_lower}(state, new_${this.name_as_lower});
};
  `
      : "";
  }

  generate_create_set_payload_function(): string {
    return `const create_set_payload = (object_type: string, id: string, property_name: string, property_value: string): Payload_Set => ({ object_type, id, property_name, property_value });\n`;
  }

  generate_set_property_function(): string {
    return `const set_${this.name_as_lower}_property = (state: Backend_State, ${this.name_as_lower}_id: string, property_name: string, property_value: string): void => {
  const payload = create_set_payload(MO_${this.schema.object_name}.class_name, ${this.name_as_lower}_id, property_name, property_value);
  state.set(payload);
};
`;
  }

  generate_set_functions(): string {
    return this.base_property_list
      .map((schema_property: Schema_Property) => {
        const lowerCaseProperty = schema_property.name.toLowerCase();
        return `export let set_${this.name_as_lower}_${lowerCaseProperty} = (state: Backend_State, ${this.name_as_lower}_id: string, new_${lowerCaseProperty}: string): void => {
  set_${this.name_as_lower}_property(state, ${this.name_as_lower}_id, "${lowerCaseProperty}", new_${lowerCaseProperty});
};
${
  schema_property.do_gen_ia_set
    ? `
let ia_set_${this.name_as_lower}_${lowerCaseProperty} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_set_${this.name_as_lower}_${lowerCaseProperty};
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
      `x['${object_name}']['ia_create_new_${this.name_as_lower}'] = ia_create_new_${this.name_as_lower};`,
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
