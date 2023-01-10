import { Bot } from '../data/Bot.d.ts';
import { MapleEventLoader } from '../lib/maple/MapleEventLoader.ts';
import { MapleUserLoader } from '../lib/maple/MapleUserLoader.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '../network/SocketClient.d.ts';

export class MaplestoryBot implements Bot {
  readonly hash: string = 'maple-bot';
  readonly icon: string = 'https://i.imgur.com/4UYI8Vy.png';
  readonly nickname: string = '메이플 봇';
  #client: SocketClient;
  #userLoader = new MapleUserLoader();
  #eventLoader = new MapleEventLoader();

  constructor(client: SocketClient) {
    this.#client = client;
  }

  onMessage(msg: SocketReceivedMessage) {
    if (msg?.value?.type === 'chat') {
      const text = msg?.value.value?.text;
      if (text) {
        if (text.startsWith('@메이플 ')) {
          const regex = /@메이플 (.*)/;
          const match = regex.exec(text);
          const id = match?.[1];
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
        } else if (text === '@메이플이벤트') {
          this.#eventLoader.load().then((events) => {
            events && this.#client.sendChat(this.hash, '메이플이벤트 나올곳');
          });
        } else if (text === '@메달력') {
          this.#client.sendChat(
            this.hash,
            'https://cs.nexon.com/helpboard/popuphelpview/22065'
          );
        }
      }
    }
  }
}
