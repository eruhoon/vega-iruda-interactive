export class OnnadaAnimationLoader {
  async load(input: string): Promise<AnimationLoaderResult | null> {
    for (let i=1; i<=3; i++) {
      let result = search(input, i);
      if (result) return result;
    }
    return null;
  }
  
  async search(input: string, idx: number): Promise<AnimationLoaderResult | null> {
    const uri = OnnadaAnimationLoader.getUri(input, idx);
    const res = await fetch(uri, {});
    if (res.status !== 200) {
      return null;
    }
    const data = await res.text();

    const jsonStatementRegex = /var ONNADA = (.*)?;/;
    //const match = jsonStatementRegex.exec(res.data);
    const match = jsonStatementRegex.exec(data);
    if (!match || !match[1]) {
      return null;
    }
    const json = JSON.parse(match[1]);
    const entries: OnanadaAnimationInfo[] = json.result.items || [];
    const results: AnimationLoaderResult[] = entries.map((e) => {
      return {
        title: e.title,
        link: e.uri,
        thumbnail: e.thumb,
        media: e.type,
        genre: e.category,
        date: e.date,
      };
    });

    const toKeyword = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    const keyword = toKeyword(input);
    let result = results.find((e) => toKeyword(e.title) === keyword);
    if (!result) {
      result = results.find((e) => toKeyword(e.title).search(keyword) >= 0);
    }
    if (!result) {
      return results[0];
    }
    return result;
  }

  static getUri(animationName: string, idx: number): string {
    const params = new URLSearchParams();
    params.set('q', animationName);
    const host = ['https://onnada.com/anime/search', 'https://onnada.com/anime/wait', 'https://onnada.com/anime/decide'];
    return `${host[idx-1]}?${params.toString()}`;
  }
}

type OnanadaAnimationInfo = {
  id: number;
  uri: string;
  thumb: string;
  category: string;
  title: string;
  type: string;
  date: string;
};

type AnimationLoaderResult = {
  title: string;
  thumbnail: string;
  link: string;
  media: string;
  genre: string;
  date: string;
};
