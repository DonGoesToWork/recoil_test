import BaseGenerator from "./BaseGenerator";
import { Note } from "./Note";

export default class Preview_Back_DM_Lib extends BaseGenerator {
  constructor(note: Note) {
    super(note);

    this.generateBackendActionFunctions();
  }

  getImportStatements(): string {
    // TODO - Alphabetize the imports so that they do not shift on save.
    return `import { ${this.generateInterfaceImports()}, IO_${this.note.object_name}, IS_${this.note.object_name}, ${this.note.object_name} } from "../Shared_Data_Models/${this.note.object_name}";
import { Payload_Add, Payload_Set, Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";

import Backend_State from "../../static_internal_logic/Backend_State";
import { Object_Class_Function_Map } from "../../Object_Registration";
import { generate_unique_id } from "../../utils/utils";
`;
  }

  generateInterfaceImports(): string {
    return [`IA_${this.name_as_lower}_create_new`, ...this.base_property_list.map((property) => `IA_${this.name_as_lower}_set_${property}`)].join(", ");
  }

  generate_ia_add_functions(): string {
    let bpl: string[] | "" = this.base_property_list.length == 0 ? "" : this.base_property_list.map((property) => `${property.toLocaleLowerCase()}: ${this.name_as_lower}.${property.toLocaleLowerCase()} === undefined ? "0" : ${this.name_as_lower}.${property.toLocaleLowerCase()}`);
    let cpl: string[] | "" =
      this.child_property_list.length == 0
        ? ""
        : this.child_property_list.map(
            (property) => `${property.toLocaleLowerCase()}: {
      ids: [],
      start_size: 0,
      max_size: 0,
      allow_empty_indexes: false,
    }`
          );
    let combo_arr: string[] = [...bpl, ...cpl];
    let combo: string = "";

    if (combo_arr.length === 0) {
      combo = "";
    } else {
      combo = `\n${this.tab_indent}${this.tab_indent}${combo_arr.join(",\n    ")},`;
    }

    let parent_id = this.has_parent() ? `\n${this.tab_indent}${this.tab_indent}parent_id: ${this.name_as_lower}.parent_id,` : "";

    let func_callback = `, _func_callback?: (state: Backend_State, new_${this.name_as_lower}: IO_${this.note.object_name}) => void`;

    return `
export let create_new_${this.name_as_lower} = (state: Backend_State, ${this.name_as_lower}: IS_${this.name}${func_callback}): void => {
  const new_${this.name_as_lower}: IO_${this.note.object_name} = {
    id: generate_unique_id(),${combo}${parent_id}
  };

  if (_func_callback) _func_callback(state, new_${this.name_as_lower});
  
  const payload: Payload_Add = {
    objectType: ${this.note.object_name}.class_name,
    object: new_${this.name_as_lower},
  };

  state.add(payload);
};
`;
  }

  generate_add_functions(): string {
    let parent_id = this.has_parent() ? `parent_id: data.parent_id,` : "";

    return `
let ia_create_new_${this.name_as_lower} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_${this.name_as_lower}_create_new;

  const new_${this.name_as_lower}: IS_${this.note.object_name} = {
    ${parent_id}
  };

  const payload: Payload_Add = {
    objectType: ${this.note.object_name}.class_name,
    object: new_${this.name_as_lower},
  };

  state.add(payload);
};
`;
  }

  generate_set_functions(): string {
    return this.base_property_list
      .map((property) => property.toLocaleLowerCase())
      .map(
        (property) => `
export let set_${this.name_as_lower}_${property} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_${this.name_as_lower}_set_${property};

  const payload: Payload_Set = {
    objectType: ${this.note.object_name}.class_name,
    id: data.${this.name_as_lower}_id,
    propertyName: ${this.note.object_name}.properties.${property},
    propertyValue: data.new_${property},
  };

  state.set(payload);
};

let ia_set_${this.name_as_lower}_${property} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_${this.name_as_lower}_set_${property};

  const payload: Payload_Set = {
    objectType: ${this.note.object_name}.class_name,
    id: data.${this.name_as_lower}_id,
    propertyName: ${this.note.object_name}.properties.${property},
    propertyValue: data.new_${property},
  };

  state.set(payload);
};`
      )
      .join("\n");
  }

  generateBackendSwitchFunction(): string {
    let combo = this.base_property_list.length == 0 ? "" : `\n${this.base_property_list.map((property) => `${this.tab_indent}x['${this.note.object_name}']['ia_set_${this.name_as_lower}_${property.toLocaleLowerCase()}'] = ia_set_${this.name_as_lower}_${property};`).join("\n")}`;

    return `\n\nexport let Register_${this.note.object_name} = (x: Object_Class_Function_Map): void => {
  x['${this.note.object_name}'] = {};
  x['${this.note.object_name}']['ia_${this.name_as_lower}_create_new'] = ia_create_new_${this.name_as_lower};${combo}
};
`;
  }

  generateBackendActionFunctions() {
    let content = "";

    // Import statements
    content += this.getImportStatements();

    content += this.generate_ia_add_functions();
    content += this.generate_add_functions();

    // Set functions
    content += this.generate_set_functions();

    // Switch handler for backend calls
    content += this.generateBackendSwitchFunction();

    this.finalContent = content;
  }
}
