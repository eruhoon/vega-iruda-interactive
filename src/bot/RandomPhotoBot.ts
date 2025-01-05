import { Photo, RandomPhotoLoader } from '../lib/random/RandomPhotoLoader.ts';
import { Scheduler } from '/framework/src/util/schedule/Scheduler.ts';
import { TextMatcher } from './util/TextMatcher.ts';
import { Bot } from '/framework/mod.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '/framework/src/network/SocketClient.d.ts';

export class RandomPhotobot implements Bot {
  readonly hash: string = 'random-photo-bot';
  readonly icon: string = 'https://i.imgur.com/KD1OX7Z.png';
  readonly nickname: string = '랜덤포토 봇';
  readonly defaultMute: boolean = false;

  readonly #client: SocketClient;
  readonly #textMatcher = new TextMatcher();
  readonly #loader = new RandomPhotoLoader();
  readonly #scheduler = new Scheduler(() => this.#onTick(), 3600000); //one-hour

  #photos: Array<Photo> = [];

  constructor(client: SocketClient) {
    this.#client = client;
  }

  activate(): void {
    this.#scheduler.start();
    this.loadPhotos();
  }

  #onTick() {
    this.updatePhotos();
  }

  async loadPhotos() {
    this.#photos = await this.#loader.load();
  }
  async updatePhotos() {
    const photos = await this.#loader.loadMore();
    this.#photos = [...photos, ...this.#photos];
  }

  #getRandomPhoto(): Photo {
    const randomPhotoIndex = Math.floor(Math.random() * this.#photos.length);
    return this.#photos[randomPhotoIndex];
  }

  onMessage(msg: SocketReceivedMessage): void {
    const { value } = msg;
    const { type } = value;

    if (type === 'chat') {
      const text = value.value.text;
      if (this.#textMatcher.isCommand(text, '랜덤짤')) {
        const photo = this.#getRandomPhoto();
        if (photo) {
          this.#client.sendGeneralPurposeCard(
            this.hash,
            JSON.stringify({
              link: photo.url,
              title: photo.tags.length > 0 ? photo.tags : '태그 없음',
              subtitle: photo.regDate,
              icon: photo.url,
              orientation: 'vertical',
              showType: 'new-window',
            }),
          );
        }
      }
    }
  }
}
