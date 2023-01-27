export class LolGallLoader {
  async load(): Promise<LolGallIssue[]> {
    const uri = 'http://mycast.xyz:9010/lolgalls';
    const res = await fetch(uri);
    const body = await res.json();

    try {
      const rawIssues: LolGallIssue[] = body as LolGallIssue[];
      const issues = rawIssues
        .map<LolGallIssue>((raw) => {
          const count = raw.count;
          const hash = raw.hash;
          const link = raw.link;
          const recommend = raw.recommend;
          const title = raw.title;
          return { count, hash, link, recommend, title };
        })
        .filter((_, i) => i < 10);
      return issues;
    } catch {
      return [];
    }
  }
}

export type LolGallIssue = {
  count: number;
  hash: string;
  link: string;
  recommend: number;
  title: string;
};
