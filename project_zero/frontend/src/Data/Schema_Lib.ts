import { Child_Schema, Schema, Schema_Property } from "./Schema";

import { get_snake_case_lowercase_input } from "../Utils/utils";

export const get_schema_parent_data = (_schema: Schema, schemas: Schema[]): string[] => {
  let parent_class_names: string[] = [];

  // Iterate over schemas to find the parent schema.
  schemas.forEach((parent: Schema) => {
    parent.child_list.forEach((child) => {
      if (child.name === _schema.object_name) {
        parent_class_names.push(parent.object_name);
      }
    });
  });

  return parent_class_names;
};

// Do I want to allow duplicates? I think so, right?

// A pet can be owned by multipple players
// So, they would see the same pet. And, if it's deleted from one parent, it should remain until deleted by both

// Our best attempt to ensure schemas are in the appropriate format before creating any forms.

export const fix_schema = (schema: Schema, schemas: Schema[], create_new_object: boolean): Schema => {
  if (create_new_object) schema = { ...schema };

  let class_names: string[] = get_schema_parent_data(schema, schemas);
  schema.parent_object_names_list = class_names;

  schema.child_list.forEach((child: Child_Schema) => {
    if (child.id_list_start_size > 1000) {
      child.id_list_start_size = 1000;
    }
  });

  schema.property_list.forEach((property: Schema_Property) => {
    property.name = get_snake_case_lowercase_input(property.name);
  });

  schema.user_interaction_list.forEach((user_interaction) => {
    user_interaction.function_name = get_snake_case_lowercase_input(user_interaction.function_name);
    user_interaction.object_1 = get_snake_case_lowercase_input(user_interaction.object_1);
    user_interaction.object_2 = get_snake_case_lowercase_input(user_interaction.object_2);
  });

  return schema;
};

export const fix_schemas = (schemas: Schema[]): Schema[] => {
  schemas = [...schemas];

  schemas.forEach((schema: Schema) => {
    fix_schema(schema, schemas, false);
  });

  return schemas;
};
