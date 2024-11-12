import { Note } from "./Note";

export default class Preview_Object_Registration_DM_Lib {
  notes: Note[];
  finalContent: string = "";

  constructor(_notes: any) {
    this.notes = _notes;
    this.generateBackendActionFunctions();
  }

  get_object_registration() {
    let filtered_notes = this.notes.filter((x: Note) => x.object_name !== "");

    let individual_imports: string = filtered_notes.map((x: Note) => `import { Register_${x.object_name} } from "../Data_Models/${x.object_name}";`).join("\n");

    let global_class_map_entries: string = filtered_notes.map((x: Note) => `Register_${x.object_name}(x);`).join(`\n  `);

    return `import Backend_State from "../../static_internal_logic/Backend_State";
import { Pre_Message_Action_Send } from "../Shared_Misc/Communication_Interfaces";
${individual_imports}

export interface Class_Function {
  (message_action: Pre_Message_Action_Send, state: Backend_State): void;
}

export interface Object_Class_Function_Map {
  [key: string]: { [key: string]: Class_Function };
}

export let Register_Objects = (x: Object_Class_Function_Map): void => {
  ${global_class_map_entries}
};`;
  }

  generateBackendActionFunctions() {
    let content = "";

    // Set functions
    content += this.get_object_registration();

    this.finalContent = content;
  }
}
