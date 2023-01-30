import { TwitchStreamDto } from './TwitchStreamDto.d.ts';

export class TwitchStreamLoader {
  readonly #clientId: string;

  constructor(clientId: string) {
    this.#clientId = clientId;
  }

  async load(keywords: string[], token: string): Promise<TwitchStreamDto[]> {
    const userQuery = keywords.map((k) => `user_login=${k}`).join('&');
    const query = `${userQuery}&first=100`;
    const host = 'https://api.twitch.tv/helix/streams';
    const url = `${host}?${query}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Client-ID': this.#clientId,
    };
    try {
      const res = await fetch(url, { headers });
      const data = await res.json();
      const streams: TwitchStreamDto[] = data.data;
      return streams;
    } catch {
      return [];
    }
  }
}
