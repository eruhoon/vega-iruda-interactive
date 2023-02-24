import { MapleCalendarLoader } from '../lib/maple/MapleCalendarLoader.ts';
import { MapleEventLoader } from '../lib/maple/MapleEventLoader.ts';
import { MapleUserLoader } from '../lib/maple/MapleUserLoader.ts';
import { SocketMessageMatcher } from './util/SocketMessageMatcher.ts';
import { Bot } from '/framework/mod.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '/framework/src/network/SocketClient.d.ts';

export class MaplestoryBot implements Bot {
  readonly hash: string = 'maple-bot';
  readonly icon: string = 'https://i.imgur.com/4UYI8Vy.png';
  readonly nickname: string = '메이플 봇';
  readonly defaultMute: boolean = false;
  #client: SocketClient;
  #userLoader = new MapleUserLoader();
  #eventLoader = new MapleEventLoader();
  #calendarLoader = new MapleCalendarLoader();
  #socketMessageMatcher = new SocketMessageMatcher();

  constructor(client: SocketClient) {
    this.#client = client;
  }

  activate(): void {}

  onMessage(msg: SocketReceivedMessage) {
    if (this.#socketMessageMatcher.isCommand(msg, '메이플이벤트')) {
      this.#eventLoader.load().then((events) => {
        events && this.#client.sendChat(this.hash, '메이플이벤트 나올곳');
      });
    }

    if (this.#socketMessageMatcher.isCommand(msg, '메달력')) {
      this.#calendarLoader.load().then((img) => {
        img && this.#client.sendChat(this.hash, img);
      });
    }

    const mapleMatch = this.#socketMessageMatcher.isArgumentMatch(
      msg,
      '메이플'
    );
    if (mapleMatch.result) {
      const id = mapleMatch.argument;
      if (id) {
        this.#userLoader.load(id).then((user) => {
          if (user) {
            this.#client.sendGeneralPurposeCard(
              this.hash,
              JSON.stringify({
                title: user.name,
                subtitle: `Lv.${user.level} ${user.jobClass}`,
                icon: user.icon,
                link: user.link,
                orientation: 'vertical',
              })
            );
          } else {
            this.#client.sendChat(this.hash, '검색 실패');
          }
        });
      } else {
        this.#client.sendChat(this.hash, '입력 오류');
      }
    }
  }
}
