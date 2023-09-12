import {
  SocketClient,
  SocketReceivedMessage,
} from '/framework/src/network/SocketClient.d.ts';
import { SocketMessageMatcher } from './util/SocketMessageMatcher.ts';
import { Bot } from '/framework/mod.ts';
import { Config } from '../../common/config/Config.ts';

export class EternalReturnBot implements Bot {
  readonly hash: string = 'eternal-return-bot';
  readonly icon: string = 'https://i.imgur.com/xqaGjWR.jpg';
  readonly nickname: string = '이바별ㅋㅋ 봇';
  readonly defaultMute: boolean = false;

  #client: SocketClient;
  #socketMessageMatcher = new SocketMessageMatcher();
  #secretKey = Config.eternalReturnApiKey;

  constructor(client: SocketClient) {
    this.#client = client;
  }

  onMessage(msg: SocketReceivedMessage): void {
    const match = this.#socketMessageMatcher.isArgumentMatch(msg, '실험체');
    if (match.result) {
      const id = match.argument;
      if (id) {
        this.loadUser(id).then((averageRank) => {
          if (averageRank === -1) {
            this.#client.sendChat(this.hash, '검색 실패');
          } else {
            this.#client.sendChat(
              this.hash,
              `${id}의 평균랭크는 #${averageRank}`
            );
          }
        });
      }
    }
  }

  activate(): void {}

  async loadUser(id: string) {
    const userNum = await this.#loadUserNum(id);
    const averageRank = await this.#loadAverageRank(userNum);
    return averageRank;
  }

  async #loadUserNum(id: string) {
    const url = `https://open-api.bser.io/v1/user/nickname?query=${id}`;
    const res = await fetch(url, {
      headers: { 'x-api-key': this.#secretKey },
    });
    const json = await res.json();
    const { code, user } = json;
    if (code !== 200) {
      return;
    }

    const { userNum } = user;
    return userNum;
  }

  async #loadAverageRank(userNum: number): Promise<number> {
    const url = `https://open-api.bser.io/v1/user/games/${userNum}`;
    const res = await fetch(url, {
      headers: { 'x-api-key': this.#secretKey },
    });
    const json = await res.json();
    const games: any[] = json.userGames;
    if (games) {
      const ranks = games.filter((_, i) => i < 10).map((e) => e.gameRank);
      const length = ranks.length;
      const rankSum = ranks.reduce((prev, cur) => prev + cur);
      const averageRank = rankSum / length;
      return averageRank;
    } else {
      return -1;
    }
  }
}
