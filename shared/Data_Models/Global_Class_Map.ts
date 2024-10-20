import { CLASS_NAME_BEE, CLASS_NAME_BEE_FARM, CLASS_NAME_BEE_HIVE, CLASS_NAME_FARMER } from "./Class_Names";

import { Bee } from "./Bee";
import { Bee_Farm } from "./Bee_Farm";
import { Bee_Hive } from "./Bee_Hive";
import { Data_Model_Base } from "./Data_Model_Base";
import { Farmer } from "./Farmer";

export let GLOBAL_CLASS_MAP: { [key: string]: Data_Model_Base } = {};

GLOBAL_CLASS_MAP[CLASS_NAME_BEE] = Bee;
GLOBAL_CLASS_MAP[CLASS_NAME_BEE_HIVE] = Bee_Hive;
GLOBAL_CLASS_MAP[CLASS_NAME_BEE_FARM] = Bee_Farm;
GLOBAL_CLASS_MAP[CLASS_NAME_FARMER] = Farmer;
