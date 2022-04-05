export interface SocketClient {
  onConnected(callback: OnConnectedCallback): void;
  onDisconnected(callback: OnDisconnectedCallback): void;
  onMessage(callback: OnMessageCallback): void;

  connect(): void;
  sendChat(bot: SocketSenderProfile, message: SocketSendMessage): void;
}

export type OnConnectedCallback = () => void;
export type OnDisconnectedCallback = () => void;
export type OnMessageCallback = (msg: SocketReceivedMessage) => void;
export type SocketReceivedMessage = ReceivedMessage<
  TextReceivedValue | ImageReceivedValue
>;

export type SocketSendMessage = string;

export type SocketSenderProfile = {
  icon: string;
  nickname: string;
};

type ReceivedMessage<V> = {
  sender: SocketSenderProfile;
  value: V;
};

type TextReceivedValue = {
  type: 'chat';
  value: { text: string };
};
type TextReceivedMessage = ReceivedMessage<TextReceivedValue>;

type ImageReceivedValue = {
  type: 'image';
  value: { src: string };
};
