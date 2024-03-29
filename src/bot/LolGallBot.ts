import { LolGallLoader } from '../lib/dcinside/LolGallLoader.ts';
import { Bot } from '/framework/mod.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '/framework/src/network/SocketClient.d.ts';
import { Scheduler } from '/framework/src/util/schedule/Scheduler.ts';

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

  onMessage(_: SocketReceivedMessage): void {}

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
