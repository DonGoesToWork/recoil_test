export interface Data_Model_Base {
  class_name: string;
  parent: string;
  children: string[];
  properties: { [key: string]: string };
  functions: { [key: string]: string };
}
