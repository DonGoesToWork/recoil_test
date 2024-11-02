import { Note } from "./Note";

export default class Preview_Global_Class_Map_Lib {
  notes: Note[];
  finalContent: string = "";

  constructor(_notes: any) {
    this.notes = _notes;
    this.finalContent = this.get_object_registration();
  }

  get_object_registration() {
    let filtered_notes = this.notes.filter((x: Note) => x.object_name !== "");
    let individual_imports: string = filtered_notes.map((x: Note) => `import { ${x.object_name} } from "../Shared_Data_Models/${x.object_name}";`).join("\n");
    let global_class_map_entries: string = filtered_notes.map((x: Note) => `GLOBAL_CLASS_MAP[\'${x.object_name}\'] = ${x.object_name};`).join("\n");

    return `${individual_imports}
import { Data_Model_Base } from "../Shared_Misc/Data_Model_Base";

export let GLOBAL_CLASS_MAP: { [key: string]: Data_Model_Base } = {};

${global_class_map_entries}`;
  }
}
