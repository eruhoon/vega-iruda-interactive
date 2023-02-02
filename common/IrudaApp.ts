import { Bot } from './data/Bot.d.ts';
import { SocketClient } from './network/SocketClient.d.ts';

export class IrudaApp {
  run(client: SocketClient, bots: Bot[]) {
    bots.forEach((bot) => bot.activate());

    client.onConnected(() => {
      console.log('connected');
    });

    client.onMessage((msg) => {
      bots.forEach((bot) => bot.onMessage(msg));
    });

    client.onDisconnected(() => {
      console.log('disconnected');
    });

    client.connect(bots);
  }
}
