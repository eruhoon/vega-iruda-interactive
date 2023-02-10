import { OnnadaAnimationLoader } from '../lib/onnada/OnnadaAnimationLoader.ts';
import { Bot } from '/framework/mod.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '/framework/src/network/SocketClient.d.ts';

export class OnnadaBot implements Bot {
  readonly hash: string = 'onnada-bot';
  readonly icon: string = 'https://i.imgur.com/dER0L3N.png';
  readonly nickname: string = '온나다 봇';
  readonly defaultMute: boolean = false;

  #client: SocketClient;
  #loader = new OnnadaAnimationLoader();

  constructor(client: SocketClient) {
    this.#client = client;
  }

  activate(): void {}

  onMessage(msg: SocketReceivedMessage): void {
    const { value } = msg;
    const { type } = value;
    if (type === 'chat') {
      const { text } = value.value;
      if (text.startsWith('@애니 ')) {
        const match = /@애니 (.*)/.exec(text);
        const word = match ? match[1] : '';
        this.#loader.load(word).then((animation) => {
          if (animation) {
            this.#client.sendGeneralPurposeCard(
              this.hash,
              JSON.stringify({
                link: animation.link,
                title: animation.title,
                icon: animation.thumbnail,
                subtitle: `${animation.genre} / ${animation.media}`,
                orientation: 'vertical',
                showType: 'in-app-browser',
              }),
            );
          } else {
            this.#client.sendChat(this.hash, '애니 없음');
          }
        });
      } else if (text.startsWith('@캐릭 ')) {
        const match = /@캐릭 (.*)/.exec(text);
        const word = match ? match[1] : '';
        this.#client.sendChat(
          this.hash,
          `https://onnada.com/character/search?q=${word}`,
        );
      }
    }
  }
}
