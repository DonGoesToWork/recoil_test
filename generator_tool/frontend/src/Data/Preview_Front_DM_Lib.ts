import BaseGenerator from "./BaseGenerator";
import { Note } from "./Note";

export default class Preview_Front_DM_Lib extends BaseGenerator {
  constructor(note: Note) {
    super(note);
    this.generateActionFunctions();
  }

  getImportStatements(): string {
    return `import { ${this.note.object_name}, ${this.generateInterfaceImports()} } from "../Shared_Data_Models/${this.note.object_name}";

import { GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT } from "../../utils/IA_Remove";
import { I_Message_Sender } from "../../utils/I_Message_Sender";
`;
  }

  generateInterfaceImports(): string {
    return [`IA_${this.name_as_lower}_create_new`, ...this.base_property_list.map((property) => `IA_${this.name_as_lower}_set_${property}`)].join(", ");
  }

  generateAddFunction(): string {
    let parent_arg = "";
    let parent_note = "";
    let input_args = "";

    if (this.has_parent()) {
      parent_arg = `, ${this.note.parent.toLocaleLowerCase()}_id: string`;
      parent_note = `,\n${this.tab_indent}${this.tab_indent}parent_id: ${this.note.parent.toLocaleLowerCase()}_id,`;
    }

    // Front-End - generateAddFunction() - We only pass the 'user_input' properties to the back-end and let it generate the rest.
    return `
export let create_new_${this.name_as_lower} = (function_send_message: Function${input_args}${parent_arg}): void => {
  let data: IA_${this.name_as_lower}_create_new = {
    object_class: ${this.note.object_name}.class_name,
    function_name: ${this.note.object_name}.functions.create_new${parent_note}    
  };

  function_send_message(data);
};
`;
  }

  generateRemoveFunction(): string {
    return `
export let remove_${this.name_as_lower} = (function_send_message: I_Message_Sender, ${this.note.parent.toLocaleLowerCase()}_id: string): void => {
  function_send_message(GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(${this.note.object_name}.class_name, ${this.note.parent.toLocaleLowerCase()}_id));
};
`;
  }

  generateSetFunctions(): string {
    return (
      "\n" +
      this.base_property_list
        .map((property) => property.toLocaleLowerCase())
        .map(
          (property) => `export let set_${this.name_as_lower}_${property} = (function_send_message: Function, ${this.name_as_lower}_id: string, new_${property}: string): void => {
  let data: IA_${this.name_as_lower}_set_${property} = {
    object_class: ${this.note.object_name}.class_name,
    function_name: ${this.note.object_name}.functions.set_${property},
    ${this.name_as_lower}_id: ${this.name_as_lower}_id,
    new_${property}: new_${property},
  };

  function_send_message(data);
};`
        )
        .join("\n\n") +
      "\n"
    );
  }

  generateActionFunctions() {
    let content = "";

    // Generate import statements
    content += this.getImportStatements();

    // Generate add function
    content += this.generateAddFunction();

    // Generate remove function
    content += this.generateRemoveFunction();

    // Generate set functions
    content += this.generateSetFunctions();

    this.finalContent = content;
  }
}
