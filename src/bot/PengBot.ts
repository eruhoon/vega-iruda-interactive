import {
  SocketClient,
  SocketReceivedMessage,
  SocketSenderProfile,
} from '../network/SocketClient.d.ts';
import { Bot } from '../data/Bot.d.ts';

export class PengBot implements Bot {
  readonly hash = 'peng-bot';
  readonly icon = 'https://i.imgur.com/ID0sKjB.jpg';
  readonly nickname = '펭 봇';
  #client: SocketClient;

  #numberChanged = false;
  #number = 0;

  constructor(client: SocketClient) {
    this.#client = client;
  }

  #asSender(): SocketSenderProfile {
    return { icon: this.icon, nickname: this.nickname };
  }

  onMessage(msg: SocketReceivedMessage) {
    this.#numberChanged = false;
    const bot = this.#asSender();

    const value = msg.value;
    if (value.type === 'chat') {
      if (value.value.text === '1' && this.#number === 0) {
        this.#numberChanged = true;
        this.#number = 1;
      } else if (value.value.text === '2' && this.#number === 1) {
        this.#numberChanged = true;
        this.#number = 2;
        this.#client.sendChat(this.hash, '짝');
      } else if (value.value.text === '짝' && this.#number === 2) {
        this.#numberChanged = true;
        this.#number = 3;
      } else if (value.value.text === '4' && this.#number === 3) {
        this.#numberChanged = true;
        this.#number = 4;
      } else if (value.value.text === '5' && this.#number === 4) {
        this.#numberChanged = false;
        this.#client.sendChat(this.hash, '하겟냐');
      }
      //   if (value.value.text === '1') {
      //     this.#client.sendChat(bot, '아쉬워요 ㅠㅠㅠ');
      //   }

      if (value.value.text === 'ㅇㅂㅂ') {
        this.#client.sendChat(this.hash, '이보세요 별님 ㅋㅋㅋㅋ');
      }
      if (value.value.text === 'ㅇㅂㄱ') {
        this.#client.sendChat(this.hash, '이보세요 간님 ㅋㅋㅋㅋ');
      }
      if (value.value.text === 'ㅇㅂㅇ') {
        this.#client.sendChat(this.hash, '이보세요 융뎅구리 ㅋㅋㅋㅋ');
      }

      if (value.value.text === '99') {
        this.#client.sendChat(this.hash, '간델게고수');
      }

      if (value.value.text === '11') {
        this.#client.sendChat(this.hash, '11 반응하는 펭봇입니다.');
      }
      if (value.value.text === '12') {
        this.#client.sendChat(this.hash, '12도  반응하는 펭봇입니다.');
      }
      if (value.value.text === '13') {
        this.#client.sendChat(this.hash, '13도 음...  반응하는 펭봇입니다.');
      }
      if (value.value.text === '14') {
        this.#client.sendChat(this.hash, '14까지..도 뭐 반응하는 펭봇입니다.');
      }
      if (value.value.text === '하미') {
        this.#client.sendChat(this.hash, '하미귀여워요');
      }
      if (value.value.text === '서리') {
        this.#client.sendChat(this.hash, '서리이뻐요');
      }
      if (value.value.text === '하미서리') {
        this.#client.sendChat(this.hash, '하미서리조와');
      }

      if (value.value.text === '간삐') {
        this.#client.sendChat(this.hash, '...');
      }
    }

    //  else if (value.type === 'image') {
    //   this.#client.sendChat(bot, '이미지도 반응해볼까...싶은 펭봇입니다.');
    // }

    if (!this.#numberChanged) {
      this.#number = 0;
    }
    this.#numberChanged = false;
  }
}
