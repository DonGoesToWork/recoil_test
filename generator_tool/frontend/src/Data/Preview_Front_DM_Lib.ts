import BaseGenerator from './BaseGenerator';
import { Note } from './Note';

export default class Preview_Front_DM_Lib extends BaseGenerator {
  constructor(note: Note) {
    super(note);
    this.generateActionFunctions();
  }

  getImportStatements(): string {
    let interface_imports =
      this.user_propery_list_dual.length == 0
        ? ''
        : ', ' +
          this.user_propery_list_dual
            .map(
              (property) =>
                `IA_${this.note.object_name.toLocaleLowerCase()}_set_${property.toLocaleLowerCase()}`
            )
            .join(', ');

    return `import { ${
      this.note.object_name
    }, IA_${this.note.object_name.toLocaleLowerCase()}_create_new${interface_imports} } from "../shared/Data_Models/${
      this.note.object_name
    }";

import { GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT } from "../shared/Data_Models/Generic_Remove";
import { iMessage_Sender } from "../Hive/HiveComponent";
`;
  }

  generateAddFunction(): string {
    let parent_arg = '';
    let parent_note = '';
    let input_args = '';

    if (this.has_parent()) {
      parent_arg = `, ${this.note.parent.toLocaleLowerCase()}_id: string`;
      parent_note = `,\n${this.tab_indent}${
        this.tab_indent
      }parent_id: ${this.note.parent.toLocaleLowerCase()}_id,`;
    }

    let props = this.user_property_list.map(
      (x) => `,\n${this.tab_indent}${this.tab_indent}${x}: _${x}`
    );

    if (this.user_property_list.length != 0) {
      input_args = this.user_property_list
        .map((x) => `, _${x.toLocaleLowerCase()}: string`)
        .join('');
    }

    // Front-End - generateAddFunction() - We only pass the 'user_input' properties to the back-end and let it generate the rest.
    return `
export let create_new_${this.note.object_name.toLocaleLowerCase()} = (function_send_message: Function${input_args}${parent_arg}): void => {
  let data: IA_${this.note.object_name.toLocaleLowerCase()}_create_new = {
    object_class: ${this.note.object_name}.class_name,
    function_name: ${
      this.note.object_name
    }.functions.create_new${props}${parent_note}    
  };

  function_send_message(data);
};`;
  }

  generateRemoveFunction(): string {
    return `

export let remove_${this.note.object_name.toLocaleLowerCase()} = (function_send_message: iMessage_Sender, ${this.note.parent.toLocaleLowerCase()}_id: string): void => {
  function_send_message(GET_NEW_DEFAULT_REMOVAL_MESSAGE_OBJECT(${
    this.note.object_name
  }.class_name, ${this.note.parent.toLocaleLowerCase()}_id));
};
`;
  }

  generateSetFunctions(): string {
    return this.combined_property_list_no_gen
      .map(
        (property) => `
export let set_${this.note.object_name.toLocaleLowerCase()}_${property.toLocaleLowerCase()} = (function_send_message: Function, ${this.note.object_name.toLocaleLowerCase()}_id: string, new_${property.toLocaleLowerCase()}: string): void => {
  let data: IA_${this.note.object_name.toLocaleLowerCase()}_set_${property.toLocaleLowerCase()} = {
    object_class: ${this.note.object_name}.class_name,
    function_name: ${
      this.note.object_name
    }.functions.set_${property.toLocaleLowerCase()},
    ${this.note.object_name.toLocaleLowerCase()}_id: ${this.note.object_name.toLocaleLowerCase()}_id,
    new_${property.toLocaleLowerCase()}: new_${property.toLocaleLowerCase()},
  };

  function_send_message(data);
};
`
      )
      .join('\n');
  }

  generateActionFunctions() {
    let content = '';

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
