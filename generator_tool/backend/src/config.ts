// src/config.ts

export const root_project_path = "E:\\Web Dev\\2024_Projects\\lootquest8\\";

export const output_paths = {
  base: `${root_project_path}\\generator_tool\\output\\`,
  backend_data_model: `${root_project_path}\\generator_tool\\output\\backend_data_models\\`,
  frontend_data_model: `${root_project_path}\\generator_tool\\output\\frontend_data_models\\`,
  global_class_map: `${root_project_path}\\generator_tool\\output\\global_class_map\\`,
  shared_data_model: `${root_project_path}\\generator_tool\\output\\shared_data_models\\`,
  object_registration: `${root_project_path}\\generator_tool\\output\\object_registration\\`,
  notes: `${root_project_path}\\generator_tool\\output\\note_data\\`,
  output_static_shared: `${root_project_path}\\generator_tool\\output_static_shared\\`,
};

export const main_project_paths = {
  frontend_data_models: `${root_project_path}\\main_project\\frontend\\src\\z_generated\\Data_Models\\`,
  frontend_data_models_shared: `${root_project_path}\\main_project\\frontend\\src\\z_generated\\Shared_Data_Models\\`,
  frontend_shared: `${root_project_path}\\main_project\\frontend\\src\\z_generated\\Shared_Misc\\`,
  backend_data_models: `${root_project_path}\\main_project\\backend\\src\\z_generated\\Data_Models\\`,
  backend_data_models_shared: `${root_project_path}\\main_project\\backend\\src\\z_generated\\Shared_Data_Models\\`,
  backend_shared: `${root_project_path}\\main_project\\backend\\src\\z_generated\\Shared_Misc\\`,
  backend_global_class_map: `${root_project_path}\\main_project\\backend\\src\\z_generated\\Global_Class_Map\\`,
  object_registration_file: `${root_project_path}\\main_project\\backend\\src\\`,
};
