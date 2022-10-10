import {
  StandardWebSocketClient,
  WebSocketClient,
} from 'https://deno.land/x/websocket@v0.1.3/mod.ts';
import { Bot } from '../data/Bot.d.ts';
import {
  OnConnectedCallback,
  OnDisconnectedCallback,
  OnMessageCallback,
  SocketClient,
  SocketReceivedMessage,
  SocketSendMessage,
} from './SocketClient.d.ts';

export class WebsocketClient implements SocketClient {
  #host: string;
  #client: WebSocketClient | null = null;
  #onConnectedCb: OnConnectedCallback = () => {};
  #onDisconnectedCb: OnDisconnectedCallback = () => {};
  #onMessageCb: OnMessageCallback = () => {};

  constructor(host: string) {
    this.#host = host;
  }

  onConnected(callback: OnConnectedCallback): void {
    this.#onConnectedCb = callback;
  }
  onDisconnected(callback: OnDisconnectedCallback): void {
    this.#onDisconnectedCb = callback;
  }

  onMessage(callback: OnMessageCallback): void {
    this.#onMessageCb = callback;
  }

  connect(bots: Bot[]): void {
    this.#client = new StandardWebSocketClient(this.#host);

    this.#client.on('open', () => {
      this.#sendLogin(bots);
      //this.#client?.send(JSON.stringify({ commandType: 'bot-login' }));

      this.#onConnectedCb();
    });

    this.#client.on('message', (msg) => {
      const raw: string = msg.data || '';
      const json = JSON.parse(raw);
      console.log(json);

      const value = json.response?.msg?.response2;
      if (!value) {
        return;
      }

      const received: SocketReceivedMessage = {
        sender: {
          icon: json.response?.icon,
          nickname: json.response?.nickname,
        },
        value: json.response?.msg?.response2,
      };
      this.#onMessageCb(received);
    });

    this.#client.on('close', () => {
      this.#onDisconnectedCb();
    });
  }

  sendChat(botHash: string, message: SocketSendMessage): void {
    this.#send({
      commandType: 'bot-chat',
      resource: {
        bot: botHash,
        msg: message,
        type: 'chat',
      },
    });
  }

  sendGeneralPurposeCard(botHash: string, message: SocketSendMessage): void {
    this.#send({
      commandType: 'bot-chat',
      resource: {
        bot: botHash,
        msg: message,
        type: 'general-purpose-card',
      },
    });
  }

  #sendLogin(bots: Bot[]) {
    this.#send({
      commandType: 'bot-login',
      resource: {
        bots: bots.map((bot) => {
          return { hash: bot.hash, icon: bot.icon, nickname: bot.nickname };
        }),
      },
    });
  }

  #send(param: SendParam) {
    this.#client?.send(JSON.stringify(param));
  }
}

type SendParam = SendChatParam | SendGeneralPurposeCardParam | LoginParam;

type SendChatParam = {
  commandType: 'bot-chat';
  resource: {
    bot: string;
    type: 'chat';
    msg: SocketSendMessage;
  };
};

type SendGeneralPurposeCardParam = {
  commandType: 'bot-chat';
  resource: {
    bot: string;
    type: 'general-purpose-card';
    msg: SocketSendMessage;
  };
};

type LoginParam = {
  commandType: 'bot-login';
  resource: {
    bots: { hash: string; icon: string; nickname: string }[];
  };
};
