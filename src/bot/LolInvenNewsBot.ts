import { Scheduler } from '../../common/schedule/Scheduler.ts';
import { Bot } from '../data/Bot.d.ts';
import { LolInvenNewsLoader } from '../lib/inven/LolInvenNewsLoader.ts';
import { SocketClient } from '../network/SocketClient.d.ts';
import { SocketReceivedMessage } from '../network/SocketClient.d.ts';

const MAX_LENGTH = 100;

export class LolInvenNewsBot implements Bot {
  readonly hash: string = 'lol-inven-news-bot';
  readonly icon: string = 'https://i.imgur.com/9u3Eqd1.png';
  readonly nickname: string = '세계정부';
  readonly defaultMute: boolean = false;

  readonly #client: SocketClient;
  readonly #loader = new LolInvenNewsLoader();
  readonly #scheduler = new Scheduler(() => this.#onTick(), 60000);

  constructor(client: SocketClient) {
    this.#client = client;
  }

  #issues: string[] = [];

  onMessage(_: SocketReceivedMessage): void {}

  activate() {
    this.#scheduler.start();
  }

  #onTick() {
    this.updateIssue();
  }

  async updateIssue() {
    const links = await this.#loader.load();
    if (this.#issues.length === 0) {
      this.#issues = links;
    }

    links.forEach((link) => {
      if (!this.#issues.includes(link)) {
        this.#issues = [link, ...this.#issues.filter((_, i) => i < MAX_LENGTH)];
        this.#client.sendChat(this.hash, link);
      }
    });
  }
}
