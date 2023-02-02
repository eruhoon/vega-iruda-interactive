import { Bot } from '../../common/data/Bot.d.ts';
import {
  SocketClient,
  SocketReceivedMessage,
  SocketSenderProfile,
} from '../../common/network/SocketClient.d.ts';

export class DiceBot implements Bot {
  readonly hash = 'dice-bot';
  readonly icon = 'https://i.imgur.com/ZxiQWxu.png';
  readonly nickname = '주사위 봇';
  readonly defaultMute: boolean = false;
  #client: SocketClient;

  constructor(client: SocketClient) {
    this.#client = client;
  }

  #asSender(): SocketSenderProfile {
    return { icon: this.icon, nickname: this.nickname };
  }

  onMessage(msg: SocketReceivedMessage) {
    const value = msg.value;
    if (value.type === 'chat') {
      if (value.value.text === '@주사위') {
        const rand = Math.ceil(Math.random() * 6);
        this.#client.sendChat(this.hash, rand.toString());
      } else if (value.value.text.startsWith('@랜덤 ')) {
        const maxNumber = this.#parseMaxNumber(value.value.text);
        const generated = this.#generateNumber(maxNumber);
        this.#client.sendChat(this.hash, generated.toString());
      }
    }
  }

  #parseMaxNumber(src: string): number {
    const match = /@랜덤 (.*)/.exec(src);
    const maxNumber = match ? parseInt(match[1]) : NaN;
    return maxNumber;
  }

  #generateNumber(max: number): number {
    if (isNaN(max) || max > 31415 || max < 2) {
      return -1;
    }
    return Math.floor(Math.random() * max) + 1;
  }
}
