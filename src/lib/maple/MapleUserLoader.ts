import { cheerio } from 'https://deno.land/x/cheerio@1.0.7/mod.ts';

export class MapleUserLoader {
  async load(id: string): Promise<MapleUser | null> {
    const url = `https://maple.gg/u/${encodeURIComponent(id)}`;
    const res = await fetch(url);
    const body = await res.text();
    const $ = cheerio.load(body);
    const $profile = $('#user-profile');

    const $icon = $profile.find('.character-image');
    const $name = $profile.find('.container h3 b');
    const $level = $profile.find('.user-summary .user-summary-item').eq(0);
    const $class = $profile.find('.user-summary .user-summary-item').eq(1);

    const name = $name?.text();
    const icon = $icon.attr('src')?.toString() || '';
    const level = Number.parseInt($level.text().replace(/Lv.(\d+).*/, '$1'));
    const jobClass = $class.text();
    if (name) {
      return { icon, name, level, jobClass, link: url };
    } else {
      return null;
    }
  }
}

type MapleUser = {
  icon: string;
  name: string;
  link: string;
  jobClass: string;
  level: number;
};
