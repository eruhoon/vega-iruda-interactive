import { SocketReceivedMessage } from '../network/SocketClient.d.ts';

export interface Bot {
  readonly hash: string;
  readonly icon: string;
  readonly nickname: string;
  readonly defaultMute: boolean;

  onMessage(msg: SocketReceivedMessage): void;
  activate(): void;
}
