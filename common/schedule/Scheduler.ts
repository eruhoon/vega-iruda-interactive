export class Scheduler {
  #timer: number | null = null;
  #onTick: OnTick;
  #interval: number;

  constructor(onTick: OnTick, interval: number) {
    this.#onTick = onTick;
    this.#interval = interval;
  }

  start() {
    this.restart();
  }

  stop() {
    if (this.#timer) {
      clearInterval(this.#timer);
    }
  }

  restart() {
    this.stop();
    this.#start();
  }

  #start() {
    this.#timer = setInterval(() => {
      this.#onTick();
    }, this.#interval);
  }
}

type OnTick = () => void;
