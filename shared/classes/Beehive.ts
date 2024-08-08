import Bee from "./Bee";

export default class Beehive {
  bee_counter: number;
  queen_bee: Bee;
  worker_bee: Bee[];

  constructor() {
    this.bee_counter = 5;
    this.queen_bee = new Bee("Queen");
    this.worker_bee = [];

    for (let i = 0; i < 5; i++) {
      this.worker_bee.push(new Bee("Worker " + i));
    }
  }
}
