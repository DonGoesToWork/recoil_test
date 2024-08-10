// Send Interfaces

export interface Message_Action_Send {
  function: string;
  args: any[];
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
  objectId: string;
  propertyName: string;
  propertyValue: any;
}

export interface Payload_Remove {
  objectType: string;
  objectId: string;
}
