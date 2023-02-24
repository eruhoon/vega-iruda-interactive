import { assertEquals } from 'https://deno.land/std@0.92.0/testing/asserts.ts';
import { SocketReceivedMessage } from '/framework/src/network/SocketClient.d.ts';
import { SocketMessageMatcher } from './SocketMessageMatcher.ts';

Deno.test('isCommand Test', () => {
  const msg: SocketReceivedMessage = {
    sender: {
      icon: '',
      nickname: '',
    },
    value: {
      type: 'chat',
      value: {
        text: '@command',
      },
    },
  };
  assertEquals(new SocketMessageMatcher().isCommand(msg, 'command'), true);
});
