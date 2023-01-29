export class LolInvenNewsLoader {
  async load(): Promise<string[]> {
    const uri = 'http://mycast.xyz:9010/inven/news';
    const res = await fetch(uri);
    const body = await res.json();

    try {
      const rawIssues = body as { link: string }[];
      const issues = rawIssues.map((raw) => raw.link).filter((_, i) => i < 10);
      return issues;
    } catch {
      return [];
    }
  }
}
