import { TwitchUserDto } from './TwitchUserDto.d.ts';

export class TwitchUserLoader {
  readonly #clientId: string;

  constructor(clientId: string) {
    this.#clientId = clientId;
  }

  async load(loginIds: string[], token: string): Promise<TwitchUserDto[]> {
    const host = 'https://api.twitch.tv/helix/users';
    const query = loginIds.map((k) => `login=${k}`).join('&');
    const url = `${host}?${query}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-ID': this.#clientId,
        },
      });
      const data = await res.json();
      const users: TwitchUserDto[] = data.data;
      return users;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
