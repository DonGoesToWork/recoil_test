import { Inventory_State } from "./Inventory_State";
import { MO_Inventory } from "../z_generated/Shared_Data_Models/Inventory";
import { SO_Farmer } from "../z_generated/Shared_Data_Models/Farmer";

export interface I_Data {
  farmer: Record<string, SO_Farmer>;
  inventory: Inventory_State;
}

export function get_data_base(): I_Data {
  return {
    farmer: {},
    inventory: new Inventory_State(),
  };
}

export class All_State {
  data: I_Data = get_data_base();

  get_object(class_name: string, object_id: string): any | undefined {
    switch (class_name) {
      case MO_Inventory.class_name:
        return this.data.inventory.data[object_id];
    }
  }
}
