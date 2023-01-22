import { WebsocketClient } from './src/network/WebsocketClient.ts';
import { config } from 'https://deno.land/std@0.131.0/dotenv/mod.ts';
import { PengBot } from './src/bot/PengBot.ts';
import { DiceBot } from './src/bot/DiceBot.ts';
import { CoronaBot } from './src/bot/CoronaBot.ts';
import { MaplestoryBot } from './src/bot/MaplestoryBot.ts';
import { Bot } from './src/data/Bot.d.ts';
import { NotificationTestBot } from './src/bot/NotificationTestBot.ts';
import { ClockBot } from './src/bot/ClockBot.ts';
import { LckBot } from './src/bot/LckBot.ts';

const env = await config();

const client = new WebsocketClient(env.WEB_SOCKET_HOST);
const pengBot = new PengBot(client);
const diceBot = new DiceBot(client);
const coronaBot = new CoronaBot(client);
const mapleBot = new MaplestoryBot(client);
const notiTestBot = new NotificationTestBot(client);
const clockBot = new ClockBot(client);
//const lckBot = new LckBot(client);

const bots: Bot[] = [
  pengBot,
  diceBot,
  coronaBot,
  mapleBot,
  notiTestBot,
  clockBot,
  //lckBot,
];

clockBot.activate();

client.onConnected(() => {
  console.log('connected');
});

client.onMessage((msg) => {
  console.log(msg);
  bots.forEach((bot) => bot.onMessage(msg));
});

client.onDisconnected(() => {
  console.log('disconnected');
});

client.connect(bots);
