export class RandomPhotoLoader {
  readonly #chunk = 500;
  #nextStart = 0;

  async load(): Promise<Array<Photo> | []> {
    return await this.#getPhotos();
  }

  async loadMore() {
    this.#nextStart += this.#chunk;
    return await this.#getPhotos();
  }

  #getUri(): string {
    const host = 'https://mycast.xyz:9011/photo';
    const params: Params = {
      q: '',
      start: this.#nextStart,
      length: this.#chunk,
    };
    const urlParams = new URLSearchParams();
    urlParams.set('start', params.start.toString());
    urlParams.set('length', params.length.toString());

    return `${host}?${urlParams}`;
  }

  async #getPhotos(): Promise<Array<Photo>> {
    const uri = this.#getUri();
    const response = await fetch(uri);

    if (response.status === 200) {
      const result: Array<PhotoDto> = await response.json();
      return result.map((dto) => {
        const tag = dto.tag || '';
        const tags = tag.split(',').filter((t) => t.length > 0);
        return {
          hash: dto.hash,
          height: dto.height,
          isForAdult: dto.adult,
          mimeType: dto.mimeType,
          regDate: dto.regDate.replace(/T.+/g, ''),
          tags,
          url: dto.url,
          viewer: 0,
          width: dto.width,
        };
      });
    }
    return [];
  }
}

export type Photo = {
  hash: string;
  url: string;
  width: number;
  height: number;
  mimeType: string;
  regDate: string;
  viewer: number;
  tags: string[];
  isForAdult: boolean;
};

type PhotoDto = {
  adult: boolean;
  hash: string;
  height: number;
  idx: number;
  mimeType: string;
  regDate: string;
  url: string;
  tag: string;
  width: number;
};

type Params = {
  q: string;
  start: number;
  length: number;
};
