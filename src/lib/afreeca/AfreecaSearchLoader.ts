export class AfreecaSearchLoader {
  async getResults(keyword: string): Promise<AfreecaSearchLoaderResult[]> {
    try {
      const params = new URLSearchParams({
        m: 'liveSearch',
        v: '1.0',
        szOrder: '',
        c: 'EUC-KR',
        szKeyword: keyword,
      });

      // const query = qs.stringify({
      //   m: 'liveSearch',
      //   v: '1.0',
      //   szOrder: '',
      //   c: 'EUC-KR',
      //   szKeyword: keyword,
      // });
      const query = params.toString();
      const url = `http://sch.afreeca.com/api.php?${query}`;
      const res = await fetch(url);
      const json = await res.json();
      //const { data: json } = await axios.get<RawResult>(url);
      const realBroad = json.REAL_BROAD || [];
      const results: AfreecaSearchLoaderResult[] = realBroad.map(
        (broad: {
          user_id: string;
          user_nick: string;
          station_name: string;
          broad_title: string;
          b_broad_title: string;
          broad_img: string;
        }) => {
          return {
            id: broad.user_id,
            nickname: broad.user_nick,
            stationName: broad.station_name,
            broadTitle: broad.broad_title,
            broadDescription: broad.b_broad_title,
            broadIcon: broad.broad_img,
          };
        },
      );
      return results;
    } catch {
      return [];
    }
  }
}

type AfreecaSearchLoaderResult = {
  id: string;
  nickname: string;
  stationName: string;
  broadTitle: string;
  broadIcon: string;
  broadDescription: string;
};

type RawResult = {
  REAL_BROAD: {
    user_id: string;
    broad_title: string;
    broad_img: string;
    b_broad_title: string;
    station_name: string;
    user_nick: string;
  }[];
};
