import { Bot } from '../data/Bot.d.ts';
import { SocketClient } from '../network/SocketClient.d.ts';
import { SocketReceivedMessage } from '../network/SocketClient.d.ts';

export class NotificationTestBot implements Bot {
  readonly hash: string = 'notification-test-bot';
  readonly icon: string = 'https://i.imgur.com/IGvqpYi.png';
  readonly nickname: string = '노티 테스트 봇';
  readonly defaultMute: boolean = true;
  #client: SocketClient;

  constructor(client: SocketClient) {
    this.#client = client;
  }

  onMessage(msg: SocketReceivedMessage): void {
    const value = msg.value;
    if (value.type === 'chat') {
      if (value.value.text === 'ping') {
        this.#client.sendChat(this.hash, 'pong');
      }
    }
  }
}
