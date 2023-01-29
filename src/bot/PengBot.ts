import {
  SocketClient,
  SocketReceivedMessage,
  SocketSenderProfile,
} from '../network/SocketClient.d.ts';
import { Bot } from '../data/Bot.d.ts';
import { NaverMovieLoader } from '../lib/naver/NaverMovieLoader.ts';

export class PengBot implements Bot {
  readonly hash = 'peng-bot2';
  readonly icon = 'https://i.imgur.com/ID0sKjB.jpg';
  readonly nickname = '펭 봇';
  readonly defaultMute: boolean = false;
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
    const value = msg.value;
    if (value.type === 'chat') {
      if (value.value.text === '박스테스트') {
        this.#client.sendChat(this.hash, '박스테스트1');
        this.#client.sendGeneralPurposeCard(
          this.hash,
          JSON.stringify({
            title: '우...마...',
            subtitle: '무스,,메.,,',
            icon: 'https://data.onnada.com/anime/202012/thumb300x400_2070905244_8a48c2b8_0.png',
            orientation: 'vertical',
          })
        );
      }
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

      if (value.value.text.startsWith('@검색 ')) {
        const match = /@검색 (.*)/.exec(value.value.text);
        const patt = /([+`~!@#$%^&*|\\\'\";:\/?])/gi;
        const word = match
          ? match[1].replace(patt, (s) => encodeURIComponent(s))
          : '';
        this.#client.sendChat(
          this.hash,
          `https://www.google.co.kr/search?q=${word}`
        );
      }

      if (value.value.text.startsWith('@영화 ')) {
        const match = /@영화 (.*)/.exec(value.value.text);
        const keyword = match ? match[1] : '';

        new NaverMovieLoader().getData(keyword).then((movie) => {
          if (movie === null) {
            this.#client.sendChat(this.hash, '영화 없음');
          } else {
            this.#client.sendGeneralPurposeCard(
              this.hash,
              JSON.stringify({
                link: movie.link,
                title: movie.title,
                icon: movie.image,
                subtitle: movie.pubDate,
                orientation: 'vertical',
                showType: 'new-window',
              })
            );
          }
        });
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
