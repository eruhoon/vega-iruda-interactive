import { WebsocketClient } from './src/network/WebSocketClient.ts';
import { config } from 'https://deno.land/std@0.131.0/dotenv/mod.ts';

const env = await config();

const client = new WebsocketClient(env.WEB_SOCKET_HOST);
client.onConnected(() => {
  console.log('connected');
});

client.onMessage((msg) => {
  console.log(msg);
  const bot = {
    icon: 'https://i.imgur.com/ID0sKjB.jpg',
    nickname: '펭 봇',
  };
  const value = msg.value;
  if (value.type === 'chat') {
    if (value.value.text === '11') {
      client.sendChat(bot, '11 반응하는 펭봇입니다.');
    }
    if (value.value.text === '12') {
      client.sendChat(bot, '12도  반응하는 펭봇입니다.');
    }
    if (value.value.text === '13') {
      client.sendChat(bot, '13도 음...  반응하는 펭봇입니다.');
    }
    if (value.value.text === '14') {
      client.sendChat(bot, '14까지..도 뭐 반응하는 펭봇입니다.');
    }
    if (value.value.text === '하미') {
      client.sendChat(bot, '하미귀여워요');
    }
    if (value.value.text === '서리') {
      client.sendChat(bot, '서리이뻐요');
    }
    if (value.value.text === '하미서리') {
      client.sendChat(bot, '하미서리조와');
    }
  } else if (value.type === 'image') {
    client.sendChat(bot, '이미지도 반응해볼까...싶은 펭봇입니다.');
  }
});

client.onDisconnected(() => {
  console.log('disconnected');
});

client.connect();
