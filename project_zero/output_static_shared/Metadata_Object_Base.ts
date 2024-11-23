export interface Child_Class_Data {
  class_name: string;
  id_list_name: string;
}

export interface Metadata_Object_Base {
  class_name: string;
  // Future todo: generate parent/child data only on back-end.
  parent_data: {
    class_names: string[];
    id_list_name: string;
  } | null;
  child_class_data_list: Child_Class_Data[];
  functions: { [key: string]: string };
}
