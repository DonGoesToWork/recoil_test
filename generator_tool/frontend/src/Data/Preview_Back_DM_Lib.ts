import BaseGenerator from "./BaseGenerator";
import { Note } from "./Note";

export default class Preview_Back_DM_Lib extends BaseGenerator {
  finalContent: string = "";

  constructor(note: Note) {
    super(note);
    this.generateBackendActionFunctions();
  }

  get_import_statements(): string {
    const { object_name } = this.note;
    const imports = [`IA_${this.name_as_lower}_create_new`, ...this.base_property_list.map((property) => `IA_${this.name_as_lower}_set_${property}`)].join(", ");

    return `import { ${imports}, IO_${object_name}, IS_${object_name}, ${object_name} } from "../Shared_Data_Models/${object_name}";
import { Payload_Add, Payload_Set, Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";

import Backend_State from "../../static_internal_logic/Backend_State";
import { Object_Class_Function_Map } from "../Object_Registration/Object_Registration";
import { generate_unique_id } from "../../utils/utils";`;
  }

  generate_ia_add_functions(): string {
    const { object_name } = this.note;
    const baseProps = this.base_property_list.length ? this.base_property_list.map((prop) => `${prop.toLowerCase()}: ${this.name_as_lower}.${prop.toLowerCase()} ?? "0"`) : [];

    const childProps = this.child_property_list.length
      ? this.child_property_list.map(
          (prop) => `${prop.toLowerCase()}: {
      ids: [],
      start_size: 0,
      max_size: 0,
      allow_empty_indexes: false,
    }`
        )
      : [];

    const comboArr = [...baseProps, ...childProps].join(",\n    ");
    const parentId = this.has_parent() ? `parent_id: ${this.name_as_lower}.parent_id,` : "";
    const funcCallback = `_func_callback?: (state: Backend_State, new_${this.name_as_lower}: IO_${object_name}) => void`;

    return `
export let create_new_${this.name_as_lower} = (state: Backend_State, ${this.name_as_lower}: IS_${object_name}, ${funcCallback}): void => {
  const new_${this.name_as_lower}: IO_${object_name} = {
    id: generate_unique_id(),${comboArr ? `\n${this.tab_indent}${this.tab_indent}${comboArr},` : ""}${parentId ? `\n${this.tab_indent}${this.tab_indent}${parentId}` : ""}
  };

  if (_func_callback) _func_callback(state, new_${this.name_as_lower});
  
  const payload: Payload_Add = {
    objectType: ${object_name}.class_name,
    object: new_${this.name_as_lower},
  };

  state.add(payload);
};
`;
  }

  generate_add_functions(): string {
    const { object_name } = this.note;
    const parentId = this.has_parent() ? `parent_id: data.parent_id,` : "";

    return `let ia_create_new_${this.name_as_lower} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_${this.name_as_lower}_create_new;
  const new_${this.name_as_lower}: IS_${object_name} = { ${parentId} };
  create_new_${this.name_as_lower}(state, new_${this.name_as_lower});
};
`;
  }

  generate_set_functions(): string {
    const { object_name } = this.note;
    return this.base_property_list
      .map((property) => property.toLowerCase())
      .map(
        (property) => `export let set_${this.name_as_lower}_${property} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_${this.name_as_lower}_set_${property};

  const payload: Payload_Set = {
    objectType: ${object_name}.class_name,
    id: data.${this.name_as_lower}_id,
    propertyName: ${object_name}.properties.${property},
    propertyValue: data.new_${property},
  };

  state.set(payload);
};

let ia_set_${this.name_as_lower}_${property} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  const data = message_action as IA_${this.name_as_lower}_set_${property};

  const payload: Payload_Set = {
    objectType: ${object_name}.class_name,
    id: data.${this.name_as_lower}_id,
    propertyName: ${object_name}.properties.${property},
    propertyValue: data.new_${property},
  };

  state.set(payload);
};`
      )
      .join("\n");
  }

  generate_backend_switch_function(): string {
    const { object_name } = this.note;
    const baseProps = this.base_property_list.map((property) => `${this.tab_indent}x['${object_name}']['ia_set_${this.name_as_lower}_${property.toLowerCase()}'] = ia_set_${this.name_as_lower}_${property};`).join("\n");

    return `
export let Register_${object_name} = (x: Object_Class_Function_Map): void => {
  x['${object_name}'] = {};
  x['${object_name}']['ia_${this.name_as_lower}_create_new'] = ia_create_new_${this.name_as_lower};
${baseProps ? `${baseProps}\n` : ""}};
`;
  }

  generateBackendActionFunctions(): void {
    this.finalContent = `${this.get_import_statements()}
${this.generate_ia_add_functions()}
${this.generate_add_functions()}
${this.generate_set_functions()}
${this.generate_backend_switch_function()}`;
  }
}
