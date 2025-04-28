// Send Interfaces

/**
 * This file is the holds all of the interfaces for base-level objects that facilite data transfer between the front-end and back-end.
 * We use payloads to add objects, set object properties and delete objects.
 * And, for convenience, we also have payloads to support a few other operations too.
 */

export interface Pre_Message_Action_Send {
  object_class: string; // points to a set of functions related to particular object, exists purely for optimization
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

export interface Message_Receive {
  messageType: string;
  payload: Payload_Add | Payload_Set | Payload_Delete;
}

export type Payload_Type = Payload_Add | Payload_Set | Payload_Delete;

export interface Payload_Add {
  object_id: string;
  object_type: string;
  object: any;
}

export interface Payload_Set {
  object_type: string;
  id: string;
  property_l1_name: string;
  property_l2_name?: string;
  property_l3_name?: string;
  property_value: any;
}

export interface Payload_Delete {
  object_type: string;
  objectId: string;
}

// New Operations to support rapidly modifying array properties without needing to send entire arrya.

export interface Payload_Property_Array_Add_Value {
  object_type: string;
  id: string;
  property_l1_name: string;
  property_l2_name?: string;
  property_l3_name?: string;
  new_value: string;
}

export interface Payload_Property_Array_Set_Value {
  object_type: string;
  id: string;
  property_l1_name: string;
  property_l2_name?: string;
  property_l3_name?: string;
  property_value: any;
}

export interface Payload_Property_Remove_Value {
  object_type: string;
  id: string;
  property_l1_name: string;
  property_l2_name?: string;
  property_l3_name?: string;
  index: number;
}
