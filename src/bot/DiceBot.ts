import {
  SocketClient,
  SocketReceivedMessage,
  SocketSenderProfile,
} from '../network/SocketClient.d.ts';

export class DiceBot {
  #icon = 'https://i.imgur.com/ZxiQWxu.png';
  #nickname = '주사위 봇';
  #client: SocketClient;
  constructor(client: SocketClient) {
    this.#client = client;
  }

  #asSender(): SocketSenderProfile {
    return { icon: this.#icon, nickname: this.#nickname };
  }

  onMessage(msg: SocketReceivedMessage) {
    const bot = this.#asSender();
    const value = msg.value;
    if (value.type === 'chat') {
      if (value.value.text === '@주사위') {
        const rand = Math.ceil(Math.random() * 6);
        this.#client.sendChat(bot, rand.toString());
      }
    }
  }
}
