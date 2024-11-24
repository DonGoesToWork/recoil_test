export type Group_Container_Class_Data = {
  class_names: string[];
  id_list_name: string;
} | null;

export interface Group_Class_Data {
  class_name: string;
  id_list_name: string;
}

export interface Metadata_Object_Base {
  class_name: string;
  parent_data: Group_Container_Class_Data;
  child_class_data_list: Group_Class_Data[];
  club_class_data_list: Group_Container_Class_Data;
  member_class_data_list: Group_Class_Data[];
  functions: { [key: string]: string };
}
