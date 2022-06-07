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
  SocketSenderProfile,
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

  sendChat(bot: SocketSenderProfile, message: SocketSendMessage): void {
    this.#send({
      commandType: 'bot-chat',
      resource: {
        bot: bot,
        msg: message,
        type: 'chat',
      },
    });
  }

  #sendLogin(bots: SocketSenderProfile[]) {
    this.#send({ commandType: 'bot-login', resource: { bots: bots } });
  }

  #send(param: SendParam) {
    this.#client?.send(JSON.stringify(param));
  }
}

type SendParam = SendChatParam | LoginParam;

type SendChatParam = {
  commandType: 'bot-chat';
  resource: {
    bot: SocketSenderProfile;
    msg: SocketSendMessage;
    type: 'chat';
  };
};

type LoginParam = {
  commandType: 'bot-login';
  resource: {
    bots: SocketSenderProfile[];
  };
};
