import { Schema } from "./Schema";
import { fix_schemas } from "./Schema_Lib";

export default class Preview_Global_Class_Map_Lib {
  schemas: Schema[];
  finalContent: string = "";

  constructor(_schemas: Schema[], do_fix_schemas: boolean) {
    this.schemas = do_fix_schemas ? fix_schemas(_schemas) : _schemas;
    this.finalContent = this.get_object_registration();
  }

  get_object_registration() {
    let filtered_schemas = this.schemas.filter((x: Schema) => x.object_name !== "");
    let individual_imports: string = filtered_schemas
      .map((x: Schema) => `import { MO_${x.object_name} } from "../Shared_Data_Models/${x.object_name}_Interfaces";`)
      .join("\n");
    let global_class_map_entries: string = filtered_schemas.map((x: Schema) => `GLOBAL_CLASS_MAP[\'${x.object_name}\'] = MO_${x.object_name};`).join("\n");

    return `${individual_imports}
import { Metadata_Object_Base } from "../Shared_Misc/Metadata_Object_Base";

export let GLOBAL_CLASS_MAP: { [key: string]: Metadata_Object_Base } = {};

${global_class_map_entries}`;
  }
}
