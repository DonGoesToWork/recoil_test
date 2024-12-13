export type Sub_Schema = {
  ids: string[];
  start_size: number;
  max_size: number;
  allow_empty_indexes: false;
};

export interface SO_Object {
  id: string;
  parent_id_data?: { [key: string]: string };
  child_id_data?: { [key: string]: Sub_Schema };
  club_id_data?: { [key: string]: string };
  member_id_data?: { [key: string]: Sub_Schema };
  [key: string]: string | { [key: string]: string } | { [key: string]: Sub_Schema } | undefined;
}

export interface I_State_Record {
  [key: string]: SO_Object; // must use generic SO_Object type instead of specifics due to typescript union limit: https://github.com/microsoft/TypeScript/issues/40803
}

export type I_Data = Record<string, I_State_Record>;
