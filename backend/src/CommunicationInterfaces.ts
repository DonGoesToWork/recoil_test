export interface Message_Arr {
  messageArr: Message[];
}

export interface Message {
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
