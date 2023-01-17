import { WebsocketClient } from './src/network/WebsocketClient.ts';
import { config } from 'https://deno.land/std@0.131.0/dotenv/mod.ts';
import { PengBot } from './src/bot/PengBot.ts';
import { DiceBot } from './src/bot/DiceBot.ts';
import { CoronaBot } from './src/bot/CoronaBot.ts';
import { MaplestoryBot } from './src/bot/MaplestoryBot.ts';
import { Bot } from './src/data/Bot.d.ts';
import { NotificationTestBot } from './src/bot/NotificationTestBot.ts';
import { ClockBot } from './src/bot/ClockBot.ts';

const env = await config();

const client = new WebsocketClient(env.WEB_SOCKET_HOST);
const pengBot = new PengBot(client);
const diceBot = new DiceBot(client);
const coronaBot = new CoronaBot(client);
const mapleBot = new MaplestoryBot(client);
const notiTestBot = new NotificationTestBot(client);
const clockBot = new ClockBot(client);

const bots: Bot[] = [
  pengBot,
  diceBot,
  coronaBot,
  mapleBot,
  notiTestBot,
  clockBot,
];

clockBot.activate();

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
  bots.forEach((bot) => bot.onMessage(msg));
});

client.onDisconnected(() => {
  console.log('disconnected');
});

client.connect(bots);
