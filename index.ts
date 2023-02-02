import { PengBot } from './src/bot/PengBot.ts';
import { DiceBot } from './src/bot/DiceBot.ts';
import { CoronaBot } from './src/bot/CoronaBot.ts';
import { MaplestoryBot } from './src/bot/MaplestoryBot.ts';
import { ClockBot } from './src/bot/ClockBot.ts';
import { LolGallBot } from './src/bot/LolGallBot.ts';
import { LolInvenNewsBot } from './src/bot/LolInvenNewsBot.ts';
import { WeatherBot } from './src/bot/WeatherBot.ts';
import { NamuWikiBot } from './src/bot/NamuWikiBot.ts';
import { OnnadaBot } from './src/bot/OnnadaBot.ts';
import { WebsocketClient } from './common/network/WebsocketClient.ts';
import { Config } from './common/config/Config.ts';
import { Bot } from './common/data/Bot.d.ts';

const client = new WebsocketClient(Config.websocketHost);
const pengBot = new PengBot(client);
const diceBot = new DiceBot(client);
const coronaBot = new CoronaBot(client);
const mapleBot = new MaplestoryBot(client);
const clockBot = new ClockBot(client);
const lolGallBot = new LolGallBot(client);
const lolInvenNewsBot = new LolInvenNewsBot(client);
const weatherBot = new WeatherBot(client);
const namuWikiBot = new NamuWikiBot(client);
const onnadaBot = new OnnadaBot(client);

const bots: Bot[] = [
  pengBot,
  diceBot,
  coronaBot,
  mapleBot,
  clockBot,
  lolGallBot,
  lolInvenNewsBot,
  weatherBot,
  namuWikiBot,
  onnadaBot,
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
