// src/types.ts

export type Note = {
  id: string;
  object_name: string;
  parent: string;
  child_list: string;
  property_list: string;
  date: string;
};

export interface Client_Message {
  object_file_data: Object_File_Data[];
  object_registration_contents: string;
  global_class_map_contents: string;
  notes: Note[];
}

export interface Object_File_Data {
  object_name: string;
  backend_data_model: string;
  frontend_data_model: string;
  shared_data_model: string;
}

export const state: Client_Message = {
  object_file_data: [],
  object_registration_contents: "",
  global_class_map_contents: "",
  notes: [],
};
