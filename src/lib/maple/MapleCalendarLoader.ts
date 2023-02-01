import { cheerio } from 'https://deno.land/x/cheerio@1.0.7/mod.ts';

export class MapleCalendarLoader {
  async load(): Promise<string | undefined> {
    const uri = 'https://cs.nexon.com/helpboard/popuphelpview/22065';
    const res = await fetch(uri, {
      method: 'GET',
      referrer: 'm.maplestory.nexon.com',
    });
    const body = await res.text();
    const $ = cheerio.load(body, {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
    });

    const $calImage = $('div#Content img');
    const image = $calImage.attr('src');

    return image;
  }
}
