import { Config } from '../../common/Config.ts';

export class NaverBookLoader {
  static readonly #CLIENT_ID = Config.naverClientId;
  static readonly #CLIENT_SECRET = Config.naverClientSecret;
  static readonly #API_URI = 'https://openapi.naver.com/v1/search/book.json';

  async getData(query: string | null): Promise<NaverBookItem | null> {
    const opt = {
      headers: {
        'X-Naver-Client-Id': NaverBookLoader.#CLIENT_ID,
        'X-Naver-Client-Secret': NaverBookLoader.#CLIENT_SECRET,
      },
      timeout: 5000,
    };
    if (query === null) {
      return null;
    }
    const res = await fetch(this.#getUri(query), opt);
    const data = (await res.json()) as NaverBookData;

    if (res.status !== 200 || !data) {
      return null;
    }

    if (data.total === 0) {
      return null;
    }

    return data.items[0];
  }

  #getUri(query: string): string {
    const params = new URLSearchParams({
      query: query,
      display: '20',
      sort: 'sim',
    });
    return `${NaverBookLoader.#API_URI}?${params.toString()}`;
  }
}

type NaverBookData = {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverBookItem[];
};

type NaverBookItem = {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: string;
  publisher: string;
  pubdate: string;
  isbn: string;
  description: string;
};
