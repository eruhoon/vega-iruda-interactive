import { config } from 'https://deno.land/std@0.131.0/dotenv/mod.ts';
const env = await config();

class ConfigInit {
  websocketHost = env.WEB_SOCKET_HOST;
  naverClientId = env.NAVER_CLIENT_ID;
  naverClientSecret = env.NAVER_CLIENT_SECRET;
  twitchClientId = env.TWITCH_CLIENT_ID;
  twitchSecretKey = env.TWITCH_SECRET_KEY;
  twitchEmbedHost = env.TWITCH_EMBED_HOST;
  eternalReturnApiKey = env.ETERNAL_RETURN_API_KEY;
}

export const Config = new ConfigInit();
