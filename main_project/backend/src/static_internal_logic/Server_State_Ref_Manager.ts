import { generate_unique_id } from "../utils/utils";

export class Server_State_Ref_Manager {
  server_state_ref: string = generate_unique_id();

  randomize_server_state_ref() {
    this.server_state_ref = generate_unique_id();
  }
}
