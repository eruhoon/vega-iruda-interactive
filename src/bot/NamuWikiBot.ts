import { Bot } from '../../common/data/Bot.d.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '../../common/network/SocketClient.d.ts';

export class NamuWikiBot implements Bot {
  readonly hash: string = 'namuwiki-bot';
  readonly icon: string = 'https://i.imgur.com/DTGNo51.png';
  readonly nickname: string = '꺼무위키 봇';
  readonly defaultMute: boolean = false;

  #client: SocketClient;

  constructor(client: SocketClient) {
    this.#client = client;
  }

  activate(): void {}

  onMessage(msg: SocketReceivedMessage): void {
    const { value } = msg;
    const { type } = value;
    if (type === 'chat') {
      const { text } = value.value;
      if (text.startsWith('@꺼라 ') || text.startsWith('@나무위키 ')) {
        const match = /@.*? (.*)/.exec(text);
        const word = match ? match[1] : '';
        this.#client.sendChat(this.hash, `https://namu.wiki/w/${word}`);
      }
    }
  }
}
