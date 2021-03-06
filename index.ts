import { WebsocketClient } from './src/network/WebsocketClient.ts';
import { config } from 'https://deno.land/std@0.131.0/dotenv/mod.ts';
import { PengBot } from './src/bot/PengBot.ts';
import { DiceBot } from './src/bot/DiceBot.ts';

const env = await config();

const client = new WebsocketClient(env.WEB_SOCKET_HOST);
const pengBot = new PengBot(client);
const diceBot = new DiceBot(client);

client.onConnected(() => {
  console.log('connected');
  // const bot = {
  //   icon: 'https://i.imgur.com/ID0sKjB.jpg',
  //   nickname: '펭 봇',
  // };
  // client.sendChat(bot, '%애 펭 봇 깜짝 등장');
});

client.onMessage((msg) => {
  console.log(msg);
  pengBot.onMessage(msg);
  diceBot.onMessage(msg);
});

client.onDisconnected(() => {
  console.log('disconnected');
});

client.connect([
  pengBot,
  diceBot,
]);
