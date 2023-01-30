export class TwitchTokenLoader {
  readonly #clientId: string;
  readonly #secretKey: string;

  constructor(clientId: string, secretKey: string) {
    this.#clientId = clientId;
    this.#secretKey = secretKey;
  }

  async load(): Promise<string | null> {
    const host = 'https://id.twitch.tv/oauth2/token';
    const params = new URLSearchParams({
      client_id: this.#clientId,
      client_secret: this.#secretKey,
      grant_type: 'client_credentials',
      scope: 'user:read:email',
    });
    const url = `${host}?${params.toString()}`;
    try {
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      return data.access_token;
    } catch {
      return null;
    }
  }
}
