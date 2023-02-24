import { ArgumentMatchResult } from './ArgumentMatchResult.d.ts';
import { TextMatcher } from './TextMatcher.ts';
import { SocketReceivedMessage } from '/framework/src/network/SocketClient.d.ts';

export class SocketMessageMatcher {
  #textMatcher = new TextMatcher();

  isCommand(msg: SocketReceivedMessage, command: string): boolean {
    if (msg?.value?.type === 'chat') {
      const text = msg.value.value.text;
      return this.#textMatcher.isCommand(text, command);
    } else {
      return false;
    }
  }

  isArgumentMatch(
    msg: SocketReceivedMessage,
    command: string
  ): ArgumentMatchResult {
    if (msg?.value?.type === 'chat') {
      const text = msg.value.value.text;
      return this.#textMatcher.isArgumentMatch(text, command);
    } else {
      return { result: false };
    }
  }
}
