import {
  SocketClient,
  SocketReceivedMessage,
  SocketSenderProfile,
} from '../network/SocketClient.d.ts';
import { Bot } from '../data/Bot.d.ts';
import { LckLoader } from '../lib/lck/LckLoader.ts';

export class LckBot implements Bot {
  readonly hash = 'lck-bot';
  readonly icon = 'https://i.imgur.com/L9m5d26.png';
  readonly nickname = 'LCK 건지개';
  readonly defaultMute: boolean = false;
  #client: SocketClient;
  #currentLink: string | null = null;

  constructor(client: SocketClient) {
    this.#client = client;
    setInterval(async () => {
      const next = await new LckLoader().load();
      if (this.#currentLink === null && next) {
        this.#client.sendChat(this.hash, '노잼스 시작 함. 링크 줌.');
        this.#client.sendChat(this.hash, next);
      } else if (this.#currentLink && next === null) {
        this.#client.sendChat(this.hash, '노잼스 끝남. 해산.');
      }
      this.#currentLink = next;
    }, 60000);
  }

  #asSender(): SocketSenderProfile {
    return { icon: this.icon, nickname: this.nickname };
  }

  onMessage(msg: SocketReceivedMessage) {
    const value = msg.value;
    if (value.type === 'chat') {
      if (value.value.text === '@lck') {
        if (this.#currentLink) {
          this.#client.sendChat(this.hash, this.#currentLink);
        } else {
          this.#client.sendChat(this.hash, '지금 안함');
        }
      }
    }
  }
}
