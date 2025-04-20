// src/types.ts

export type Schema = {
  [key: string]: any;
};

// Must sync with TransmitLib.ts on frontend
export interface Client_Message {
  object_file_data: Object_File_Data[];
  object_registration_contents: string;
  global_class_map_contents: string;
  app_state: string;
  schemas: Schema[]; // Don't care about type at all here really though
}

// Must sync with TransmitLib.ts on frontend
export interface Object_File_Data {
  object_name: string;
  backend_data_model: string;
  frontend_data_model: string;
  shared_object_state: string;
  shared_data_model: string;
}

export const state: Client_Message = {
  object_file_data: [],
  object_registration_contents: "",
  global_class_map_contents: "",
  app_state: "",
  schemas: [],
};
