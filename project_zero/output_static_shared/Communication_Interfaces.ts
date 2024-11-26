// Send Interfaces

export interface Pre_Message_Action_Send {
  object_class: string; // points to set of functions related to poarticular object, exists purely for optimization
  function_name: string;
  id?: string; // removal messages include id field
}

export interface Message_Action_Send {
  server_state_ref: string; // a client can only submit changes when it is on the latest server state ref, otherwise, the request is rejected
  object_class: string; // points to set of functions related to poarticular object, exists purely for optimization
  function_name: string;
  [key: string]: string; // can have any number of additional string parameters
}

// Receive Interfaces

export interface Message_Recieve {
  messageType: string;
  payload: Payload_Add | Payload_Set | Payload_Delete;
}

export interface Payload_Add {
  object_id: string;
  object_type: string;
  object: any;
}

export interface Payload_Set {
  object_type: string;
  id: string;
  property_name: string;
  property_value: any;
}

export interface Payload_Delete {
  object_type: string;
  objectId: string;
}
