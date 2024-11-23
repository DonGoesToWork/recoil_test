import { Schema } from "./Schema";
import { fix_schemas } from "./Schema_Lib";

export default class Preview_Object_Registration_DM_Lib {
  schemas: Schema[];
  final_content: string = "";

  constructor(_schemas: Schema[], do_fix_schemas: boolean) {
    this.schemas = do_fix_schemas ? fix_schemas(_schemas) : _schemas;
    this.generate_backend_action_functions();
  }

  get_object_registration() {
    let filtered_schemas = this.schemas.filter((x: Schema) => x.object_name !== "");

    let individual_imports: string = filtered_schemas.map((x: Schema) => `import { Register_${x.object_name} } from "../Data_Models/${x.object_name}";`).join("\n");

    let global_class_map_entries: string = filtered_schemas.map((x: Schema) => `Register_${x.object_name}(x);`).join(`\n  `);

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

  generate_backend_action_functions() {
    let content = "";

    // Set functions
    content += this.get_object_registration();

    this.final_content = content;
  }
}
