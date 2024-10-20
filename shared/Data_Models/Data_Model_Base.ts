export interface Data_Model_Base {
  class_name: string;
  // Future todo: generate parent/child data only on back-end.
  parent_data: {
    class_name: string;
    id_list_name: string;
  } | null;
  child_class_name_list: string[];
  properties: { [key: string]: string };
  functions: { [key: string]: string };
}
