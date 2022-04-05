import {
  StandardWebSocketClient,
  WebSocketClient,
} from 'https://deno.land/x/websocket@v0.1.3/mod.ts';
import {
  OnConnectedCallback,
  OnDisconnectedCallback,
  OnMessageCallback,
  SocketSendMessage,
  SocketClient,
  SocketReceivedMessage,
  SocketSenderProfile,
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

  connect(): void {
    this.#client = new StandardWebSocketClient(this.#host);

    this.#client.on('open', () => {
      this.#client?.send(JSON.stringify({ commandType: 'bot-login' }));

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

  #send(param: SendParam) {
    this.#client?.send(JSON.stringify(param));
  }
}

type SendParam = SendChatParam;

type SendChatParam = {
  commandType: 'bot-chat';
  resource: {
    bot: SocketSenderProfile;
    msg: SocketSendMessage;
    type: 'chat';
  };
};
