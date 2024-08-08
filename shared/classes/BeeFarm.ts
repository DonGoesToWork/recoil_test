import Beehive from "./Beehive";

export default class Bee_Farm {
  beehive_count: number;
  beehive_name: string;
  beehive: Beehive;

  constructor() {
    this.beehive_count = 5;
    this.beehive_name = "Beehive 1";
    this.beehive = new Beehive();
  }
}
