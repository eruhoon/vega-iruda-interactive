import { Bot } from '../../common/data/Bot.d.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '../../common/network/SocketClient.d.ts';

export class ClockBot implements Bot {
  readonly hash: string = 'clock-bot';
  readonly icon: string = 'https://i.imgur.com/OBx8TXr.jpg';
  readonly nickname: string = '콕스워즈 봇';
  readonly defaultMute: boolean = false;

  #client: SocketClient;

  #timer: number | null = null;

  constructor(client: SocketClient) {
    this.#client = client;
  }

  onMessage(msg: SocketReceivedMessage): void {
    const { value } = msg;
    const { type } = value;
    if (type === 'chat') {
      const text = value.value.text;
      if (text === '!시계' || text === '!시간') {
        this.#client.sendChat(this.hash, this.#createTime());
      }
    }
  }

  #createTime(): string {
    const curDate = new Date();
    const h = curDate.getHours();
    const m = curDate.getMinutes();
    const s = curDate.getSeconds();
    const msg = `${h}시 ${m}분 ${s}초!!`;
    return msg;
  }

  activate(): void {
    this.#registerTimer();
  }

  deactivate(): void {
    this.#unregisterTimer();
  }

  #registerTimer() {
    const date = new Date();
    const now = date.getTime();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    const next = date.getTime();
    this.#timer = setTimeout(() => {
      this.#client.sendChat(this.hash, `${date.getHours()}시!!`);
      this.#registerTimer();
    }, next - now);
  }

  #unregisterTimer(): void {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
}
