import BaseGenerator from "./BaseGenerator";
import { Note } from "./Note";

export default class Preview_Back_DM_Lib extends BaseGenerator {
  constructor(note: Note) {
    super(note);

    this.generateBackendActionFunctions();
  }

  getImportStatements(): string {
    return `import { ${this.note.object_name}, ${this.generateInterfaceImports()}, IO_${this.note.object_name} } from "../shared/Data_Models/${this.note.object_name}";
import { Payload_Add, Payload_Set, Pre_Message_Action_Send } from "../shared/Communication/Communication_Interfaces";

import Backend_State from "../static_internal_logic/Backend_State";
import { Object_Class_Function_Map } from "../Object_Registration";
import { generate_unique_id } from "../static_internal_logic/utils.ts"; // todo implement
`;
  }

  generateInterfaceImports(): string {
    return [`IA_${this.note.object_name.toLocaleLowerCase()}_create_new`, ...this.combined_property_list_no_gen.map((property) => `IA_${this.note.object_name.toLocaleLowerCase()}_set_${property}`)].join(", ");
  }

  generateAddFunction(): string {
    let upl: string[] | "" = this.user_property_list.length == 0 ? "" : this.user_property_list.map((property) => `${property.toLocaleLowerCase()}: data.${property.toLocaleLowerCase()}`);

    let bpl: string[] | "" = this.user_property_list_raw.length == 0 ? "" : this.user_property_list_raw.map((property) => `${property.toLocaleLowerCase()}: ''`);

    let bppl: string[] | "" = this.base_property_list.length == 0 ? "" : this.base_property_list.map((property) => `${property.toLocaleLowerCase()}: ''`);

    let gpl: string[] | "" = this.child_property_list.length == 0 ? "" : this.child_property_list.map((property) => `${property.toLocaleLowerCase()}: []`);

    let combo_arr: string[] = [...upl, ...bppl, ...bpl, ...gpl];
    let combo: string = "";

    if (combo_arr.length === 0) {
      combo = "";
    } else {
      combo = `\n${this.tab_indent}${this.tab_indent}${combo_arr.join(",\n    ")},`;
    }

    return `
let create_new_${this.note.object_name.toLocaleLowerCase()} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_${this.note.object_name.toLocaleLowerCase()}_create_new;

  const new_${this.note.object_name.toLocaleLowerCase()}: IO_${this.note.object_name} = {
    id: generate_unique_id(), // todo implement${combo}
    parent_id: data.parent_id
  };

  const payload: Payload_Add = {
    objectType: ${this.note.object_name}.class_name,
    object: new_${this.note.object_name.toLocaleLowerCase()},
  };

  state.add(payload);
};
`;
  }

  generateSetFunction(): string {
    return this.combined_property_list_no_gen
      .map(
        (property) => `
let set_${this.note.object_name.toLocaleLowerCase()}_${property.toLocaleLowerCase()} = (message_action: Pre_Message_Action_Send, state: Backend_State): void => {
  let data = message_action as IA_${this.note.object_name.toLocaleLowerCase()}_set_${property.toLocaleLowerCase()};

  const payload: Payload_Set = {
    objectType: ${this.note.object_name}.class_name,
    id: data.${this.note.object_name.toLocaleLowerCase()}_id,
    propertyName: ${this.note.object_name}.properties.${property.toLocaleLowerCase()},
    propertyValue: data.new_${property.toLocaleLowerCase()},
  };

  state.set(payload);
};`
      )
      .join("\n");
  }

  generateBackendSwitchFunction(): string {
    let combo =
      this.combined_property_list_no_gen.length == 0
        ? ""
        : `\n${this.combined_property_list_no_gen.map((property) => `${this.tab_indent}state_object_array['set_${this.note.object_name.toLocaleLowerCase()}_${property.toLocaleLowerCase()}'] = set_${this.note.object_name.toLocaleLowerCase()}_${property};`).join("\n")}`;

    return `\n\nexport let Register_${this.note.object_name} = (x: Object_Class_Function_Map): void => {
  let state_object_array = x['${this.note.object_name}'];
  state_object_array['${this.note.object_name.toLocaleLowerCase()}_create_new'] = create_new_${this.note.object_name.toLocaleLowerCase()};${combo}
};
`;
  }

  generateBackendActionFunctions() {
    let content = "";

    // Import statements
    content += this.getImportStatements();

    // Add function
    content += this.generateAddFunction();

    // Set functions
    content += this.generateSetFunction();

    // Switch handler for backend calls
    content += this.generateBackendSwitchFunction();

    this.finalContent = content;
  }
}
