import axios from 'axios';
import * as cheerio from 'cheerio';

export interface Announcement {
  title: string;
  provider: string;
  regionName: string;
  url: string;
  publishedDate: Date;
}

export async function scrapeLH(): Promise<Announcement[]> {
  // 실제 구현 시 LH 청약플러스의 공지사항 URL 및 셀렉터가 필요합니다.
  // 아래는 구조를 보여주기 위한 예시 코드입니다.
  const url = 'https://apply.lh.or.kr/lhf/is/contents.do'; // 예시 URL
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results: Announcement[] = [];

    // 예시 셀렉터: 테이블 행(tr) 순회
    $('table.board_list tbody tr').each((_, el) => {
      const title = $(el).find('td.title').text().trim();
      const region = $(el).find('td.region').text().trim(); // 지역 정보 추출
      const link = $(el).find('a').attr('href');
      const dateStr = $(el).find('td.date').text().trim();

      if (title && link) {
        results.push({
          title,
          provider: 'LH',
          regionName: region || '전국',
          url: link.startsWith('http') ? link : `https://apply.lh.or.kr${link}`,
          publishedDate: new Date(dateStr),
        });
      }
    });

    return results;
  } catch (error) {
    console.error('LH Scraping Error:', error);
    return [];
  }
}
