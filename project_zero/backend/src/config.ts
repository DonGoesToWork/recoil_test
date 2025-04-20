// src/config.ts

export const root_project_path = "E:\\web_dev\\loot_quest\\";

export const output_paths = {
  base: `${root_project_path}project_zero\\output\\`,
  backend_data_model: `${root_project_path}project_zero\\output\\backend_data_models\\`,
  frontend_data_model: `${root_project_path}project_zero\\output\\frontend_data_models\\`,
  shared_object_state: `${root_project_path}project_zero\\output\\shared_object_state\\`,
  shared_data_model: `${root_project_path}project_zero\\output\\shared_data_models\\`,
  data_registration: `${root_project_path}project_zero\\output\\data_registration\\`,
  schemas: `${root_project_path}project_zero\\output\\schema_data\\`,
  app_state: `${root_project_path}project_zero\\output\\app_state\\`,
  output_static_shared: `${root_project_path}project_zero\\output_static_shared\\`, // intentionally NOT under '/output' folder path (do not correct/change)
};

export const main_project_paths = {
  frontend_data_models: `${root_project_path}main_project\\frontend\\src\\z_generated\\Data_Models\\`,
  frontend_shared_object_state: `${root_project_path}main_project\\frontend\\src\\z_generated\\Shared_Object_State\\`,
  frontend_data_models_shared: `${root_project_path}main_project\\frontend\\src\\z_generated\\Shared_Data_Models\\`,
  frontend_shared: `${root_project_path}main_project\\frontend\\src\\z_generated\\Shared_Misc\\`,
  frontend_app_state: `${root_project_path}main_project\\frontend\\src\\z_generated\\App_State\\`,
  backend_data_models: `${root_project_path}main_project\\backend\\src\\z_generated\\Data_Models\\`,
  backend_data_models_shared: `${root_project_path}main_project\\backend\\src\\z_generated\\Shared_Data_Models\\`,
  backend_shared_object_state: `${root_project_path}main_project\\backend\\src\\z_generated\\Shared_Object_State\\`,
  backend_shared: `${root_project_path}main_project\\backend\\src\\z_generated\\Shared_Misc\\`,
  backend_data_registration: `${root_project_path}main_project\\backend\\src\\z_generated\\Data_Registration\\`,
  backend_app_state: `${root_project_path}main_project\\backend\\src\\z_generated\\App_State\\`,
};
