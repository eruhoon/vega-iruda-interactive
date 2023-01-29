import { config } from 'https://deno.land/std@0.131.0/dotenv/mod.ts';
const env = await config();

class ConfigInit {
  websocketHost = env.WEB_SOCKET_HOST;
  naverClientId = env.NAVER_CLIENT_ID;
  naverClientSecret = env.NAVER_CLIENT_SECRET;
}

export const Config = new ConfigInit();
