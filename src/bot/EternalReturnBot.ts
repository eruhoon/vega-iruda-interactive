import {
  SocketClient,
  SocketReceivedMessage,
} from '/framework/src/network/SocketClient.d.ts';
import { SocketMessageMatcher } from './util/SocketMessageMatcher.ts';
import { Bot } from '/framework/mod.ts';

export class EternalReturnBot implements Bot {
  readonly hash: string = 'eternal-return-bot';
  readonly icon: string = 'https://i.imgur.com/xqaGjWR.jpg';
  readonly nickname: string = '이바별ㅋㅋ 봇';
  readonly defaultMute: boolean = false;

  #client: SocketClient;
  #socketMessageMatcher = new SocketMessageMatcher();

  constructor(client: SocketClient) {
    this.#client = client;
  }

  onMessage(msg: SocketReceivedMessage): void {
    if (this.#socketMessageMatcher.isCommand(msg, 'ㅇㅂㅂ')) {
      this.#client.sendChat(this.hash, 'https://i.imgur.com/CE6e1ez.png');
    } else {
      const match = this.#socketMessageMatcher.isArgumentMatch(msg, '실험체');
      console.log(match);
      if (match.result) {
        const id = match.argument;
        if (id) {
          this.#client.sendChat(this.hash, `${id} 검색 결과 나와야 할 곳 `);
        }
      }
    }
  }

  activate(): void {}
}
