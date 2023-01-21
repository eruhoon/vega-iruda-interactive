import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';

export class LckLoader {
  async load(): Promise<string | null> {
    const url =
      'https://game.naver.com/esports/League_of_Legends/live/lck_2023_spring';
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
   // const browser = await puppeteer.launch({
      // headless: false,
      // devtools: true,
 //   });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForNetworkIdle();

    try {
      const element = await page.waitForSelector('em.menu_badge__2x7xG', {
        timeout: 3000,
      });
      if (element) {
        console.log('방송있음! 1080p로 변경합니다.');

        const settingBtn = await page.waitForSelector(
          'button.nng_btn_control.setting'
        );
        settingBtn?.click();

        const resolutionBtn = await page.waitForSelector(
          'button.nng_btn_panel'
        );
        resolutionBtn?.click();

        const resListBtn = await page.$$(
          '.nng_setting_panel .nng_panel_scroll li '
        );
        resListBtn.at(6)?.click();

        const res = await page.waitForResponse((r) =>
          r.url().includes('chunklist_1080p')
        );
        const result = (res.url() as string) || null;
        return result;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
    } finally {
      await browser.close();
    }
    return null;
  }
}
