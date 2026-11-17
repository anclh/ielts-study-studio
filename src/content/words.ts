import type { Word } from '../model'

type Row = [term: string, meaning: string, partOfSpeech: string, example: string]
function topic(id: string, rows: Row[]): Word[] {
  return rows.map(([term, meaning, partOfSpeech, example]) => ({ id: term.toLowerCase(), term, meaning, partOfSpeech, example, topic: id }))
}

export const topicNames: Record<string, string> = {
  environment: '環境與永續',
  education: '教育與學習',
  cities: '城市與生活',
}

export const words: Word[] = [
  ...topic('environment', [
    ['sustainable', '永續的', 'adj.', 'The city needs a sustainable transport plan.'],
    ['habitat', '棲息地', 'n.', 'The wetland provides a habitat for birds.'],
    ['conserve', '保護；節約', 'v.', 'We should conserve water during dry months.'],
    ['emission', '排放物', 'n.', 'New rules aim to reduce carbon emissions.'],
    ['renewable', '可再生的', 'adj.', 'Solar power is a renewable energy source.'],
    ['biodiversity', '生物多樣性', 'n.', 'The forest has remarkable biodiversity.'],
    ['drought', '乾旱', 'n.', 'The region faced a long drought last year.'],
    ['recycle', '回收再利用', 'v.', 'Residents can recycle glass at the station.'],
    ['resource', '資源', 'n.', 'Clean water is an essential resource.'],
    ['climate', '氣候', 'n.', 'Climate patterns are changing in the region.'],
  ]),
  ...topic('education', [
    ['curriculum', '課程內容', 'n.', 'The school updated its science curriculum.'],
    ['assess', '評估', 'v.', 'Teachers assess progress throughout the term.'],
    ['literacy', '讀寫能力', 'n.', 'The programme supports adult literacy.'],
    ['retain', '記住；保留', 'v.', 'Short reviews help students retain new words.'],
    ['feedback', '回饋', 'n.', 'Helpful feedback shows how to improve.'],
    ['lecture', '講座；授課', 'n.', 'The lecture begins at ten in the morning.'],
    ['research', '研究', 'n.', 'Her research focuses on language learning.'],
    ['enrol', '註冊入學', 'v.', 'Students can enrol online this week.'],
    ['scholarship', '獎學金', 'n.', 'She received a scholarship for university.'],
    ['revise', '複習；修訂', 'v.', 'I revise my notes before an exam.'],
  ]),
  ...topic('cities', [
    ['commute', '通勤', 'v.', 'Many workers commute by train.'],
    ['pedestrian', '行人', 'n.', 'The crossing is safer for pedestrians now.'],
    ['infrastructure', '基礎設施', 'n.', 'The city invested in transport infrastructure.'],
    ['congestion', '交通壅塞', 'n.', 'Congestion is worst during the morning rush.'],
    ['accessible', '無障礙的；易到達的', 'adj.', 'The station is accessible by lift.'],
    ['suburb', '郊區', 'n.', 'They moved to a quiet suburb.'],
    ['facility', '設施', 'n.', 'The sports facility opens on Monday.'],
    ['resident', '居民', 'n.', 'Residents asked for more green space.'],
    ['district', '區域', 'n.', 'The arts district attracts many visitors.'],
    ['density', '密度', 'n.', 'Population density is higher near the centre.'],
  ]),
]
