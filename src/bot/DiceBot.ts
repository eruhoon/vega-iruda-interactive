import {
  SocketClient,
  SocketReceivedMessage,
  SocketSenderProfile,
} from '../network/SocketClient.d.ts';
import { Bot } from '../data/Bot.d.ts';

export class DiceBot implements Bot {
  readonly hash = 'dice-bot';
  readonly icon = 'https://i.imgur.com/ZxiQWxu.png';
  readonly nickname = '주사위 봇';
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
      }
    }
  }
}
