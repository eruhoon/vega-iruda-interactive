import { Bot } from './data/Bot.d.ts';
import { SocketClient } from './network/SocketClient.d.ts';
import { WebsocketClient } from './network/WebsocketClient.ts';

export class IrudaApp {
  readonly client: SocketClient;

  constructor(host: string) {
    this.client = new WebsocketClient(host);
  }

  run(bots: Bot[]) {
    bots.forEach((bot) => bot.activate());

    this.client.onConnected(() => {
      console.log('connected');
    });

    this.client.onMessage((msg) => {
      bots.forEach((bot) => bot.onMessage(msg));
    });

    this.client.onDisconnected(() => {
      console.log('disconnected');
    });

    this.client.connect(bots);
  }
}
