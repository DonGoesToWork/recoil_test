import Inventory_State from "./Inventory_State";
import { SO_Farmer } from "../z_generated/Shared_Data_Models/Farmer";
import { SO_Inventory } from "../z_generated/Shared_Data_Models/Inventory";
import { SO_Object } from "../z_generated/Shared_Misc/Sub_Schema";

// let data: I_Data = {
//   inventory: {
//     "1234": {},
//   },
//   farmer: {
//     "5678": {},
//   },
// };

// old:

// represents: id to SO_Object
// export interface I_State_Record {
//   [key: string]: SO_Object; // must use generic SO_Object type instead of specifics due to typescript union limit: https://github.com/microsoft/TypeScript/issues/40803
// }

// export type I_Data = Record<string, I_State_Record>;
