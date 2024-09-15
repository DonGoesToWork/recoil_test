// Send Interfaces

export interface Pre_Message_Action_Send {
  object_class: string; // points to set of functions related to poarticular object, exists purely for optimization
  function_name: string;
}

export interface Message_Action_Send {
  server_state_ref: string; // a client can only submit changes when it is on the latest server state ref, otherwise, the request is rejected
  object_class: string; // points to set of functions related to poarticular object, exists purely for optimization
  function_name: string;
  [key: string]: string; // can have any number of additional string parameters
}

// Receive Interfaces

export interface Message_Arr_Recieve {
  messageArr: Message_Recieve[];
}

export interface Message_Recieve {
  messageType: string;
  payload: Payload_Add | Payload_Set | Payload_Remove;
}

export interface Payload_Add {
  objectType: string;
  object: any;
}

export interface Payload_Set {
  objectType: string;
  id: string;
  propertyName: string;
  propertyValue: any;
}

export interface Payload_Remove {
  objectType: string;
  objectId: string;
}
