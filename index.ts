import { WebsocketClient } from './src/network/WebsocketClient.ts';
import { config } from 'https://deno.land/std@0.131.0/dotenv/mod.ts';
import { PengBot } from './src/bot/PengBot.ts';
import { DiceBot } from './src/bot/DiceBot.ts';
import { CoronaBot } from './src/bot/CoronaBot.ts';
import { MaplestoryBot } from './src/bot/MaplestoryBot.ts';
import { Bot } from './src/data/Bot.d.ts';
import { NotificationTestBot } from './src/bot/NotificationTestBot.ts';
import { ClockBot } from './src/bot/ClockBot.ts';
import { LolGallBot } from './src/bot/LolGallBot.ts';
import { LolInvenNewsBot } from './src/bot/LolInvenNewsBot.ts';
import { WeatherBot } from './src/bot/WeatherBot.ts';
import { NamuWikiBot } from './src/bot/NamuWikiBot.ts';

const env = await config();

const client = new WebsocketClient(env.WEB_SOCKET_HOST);
const pengBot = new PengBot(client);
const diceBot = new DiceBot(client);
const coronaBot = new CoronaBot(client);
const mapleBot = new MaplestoryBot(client);
const notiTestBot = new NotificationTestBot(client);
const clockBot = new ClockBot(client);
const lolGallBot = new LolGallBot(client);
const lolInvenNewsBot = new LolInvenNewsBot(client);
const weatherBot = new WeatherBot(client);
const namuWikiBot = new NamuWikiBot(client);
const bots: Bot[] = [
  pengBot,
  diceBot,
  coronaBot,
  mapleBot,
  notiTestBot,
  clockBot,
  lolGallBot,
  lolInvenNewsBot,
  weatherBot,
  namuWikiBot,
];

clockBot.activate();
lolGallBot.activate();
lolInvenNewsBot.activate();

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
