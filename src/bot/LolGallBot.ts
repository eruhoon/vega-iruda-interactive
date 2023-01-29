import { Scheduler } from '../../common/schedule/Scheduler.ts';
import { Bot } from '../data/Bot.d.ts';
import { LolGallLoader } from '../lib/dcinside/LolGallLoader.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '../network/SocketClient.d.ts';

const MAX_LENGTH = 100;

export class LolGallBot implements Bot {
  readonly hash: string = 'lol-gall-bot';
  readonly icon: string = 'https://i.imgur.com/r1jw9seb.png';
  readonly nickname: string = '가붕이';
  readonly defaultMute: boolean = true;
  #issues: string[] = [];
  readonly #client: SocketClient;
  readonly #loader = new LolGallLoader();
  readonly #scheduler = new Scheduler(() => this.#onTick(), 60000);

  constructor(client: SocketClient) {
    this.#client = client;
  }

  onMessage(msg: SocketReceivedMessage): void {}

  activate() {
    this.#scheduler.start();
  }

  #onTick() {
    this.updateIssue();
  }

  async updateIssue() {
    const issues = await this.#loader.load();
    const links = issues
      .filter((_, i) => i < MAX_LENGTH)
      .map((issue) => issue.link);

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
