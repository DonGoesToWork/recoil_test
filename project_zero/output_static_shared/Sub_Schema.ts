// Represents an array of n-depth data
export type Sub_Schema = {
  ids: string[];
  start_size: number;
  max_size: number;
  allow_empty_indexes: false;
};

// SO = Stateful Object
export interface SO_Object {
  id: string;
  parent_id_data?: { [key: string]: string[] };
  child_id_data?: { [key: string]: Sub_Schema };
  club_id_data?: { [key: string]: string[] };
  member_id_data?: { [key: string]: Sub_Schema };
  [key: string]: string | { [key: string]: string[] } | { [key: string]: Sub_Schema } | undefined;
}
