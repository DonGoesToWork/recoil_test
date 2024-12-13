export interface Metadata_Object_Base {
  class_name: string;
  parent_class_data: string[];
  child_class_data_list: string[];
  club_class_data: string[];
  member_class_data_list: string[];
  functions: { [key: string]: string };
}
