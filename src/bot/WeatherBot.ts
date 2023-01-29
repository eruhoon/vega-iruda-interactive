import { Bot } from '../data/Bot.d.ts';
import { CityWeatherLoader } from '../lib/weather/CityWeatherLoader.ts';
import {
  SocketClient,
  SocketReceivedMessage,
} from '../network/SocketClient.d.ts';

const TYPHOON_LINK =
  'https://earth.nullschool.net/ko/#current/wind/surface/level/overlay=total_cloud_water/orthographic=-228.58,29.11,1089';
const DUST_LINK = 'https://weather.naver.com/air/';
const POLLEN_LINK =
  'https://www.weather.go.kr/weather/lifenindustry/life_jisu.jsp?JISU_INFO=jisudaymap_D06';

const WEATHER_LINK = 'https://www.weather.go.kr/';
export class WeatherBot implements Bot {
  readonly hash: string = 'weather-bot';
  readonly icon: string = 'https://i.imgur.com/B82UoVL.png';
  readonly nickname: string = '기상캐스터 잔나';
  readonly defaultMute: boolean = false;

  #client: SocketClient;

  constructor(client: SocketClient) {
    this.#client = client;
  }

  onMessage(msg: SocketReceivedMessage): void {
    const { value } = msg;
    const { type } = value;
    if (type === 'chat') {
      const { text } = value.value;
      if (text === '@태풍') {
        this.#client.sendChat(this.hash, TYPHOON_LINK);
      } else if (text === '@미세' || text === '@미먼' || text === '@미세먼지') {
        this.#client.sendChat(this.hash, DUST_LINK);
      } else if (text === '@꽃가루') {
        this.#client.sendChat(this.hash, POLLEN_LINK);
      } else if (text.startsWith('@웨더 ')) {
        const match = /@웨더 (.*)/.exec(text);
        const requestCity = match ? match[1] : '';
        console.log(requestCity);
        new CityWeatherLoader().load(requestCity).then((results) => {
          results.forEach((result) => {
            this.#client.sendGeneralPurposeCard(
              this.hash,
              JSON.stringify({
                title: `${result.name} (${result.weather})`,
                subtitle: `${result.temp}℃(${result.temp2}℃)`,
                icon: result.img,
                link: WEATHER_LINK,
                orientation: 'horizontal',
              })
            );
          });
        });
      }
    }
  }
}
