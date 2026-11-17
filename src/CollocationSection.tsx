import { useEffect, useMemo, useState } from 'react'
import type { CollocationLesson } from './collocations'
import type { CollocationProgress } from './collocationStorage'

type Card = { phrase: string; yue: string; weak: string; model: string; frame: string; mistake: string; lessonId: string; lesson: number; topic: string }
type Props = { lessons: CollocationLesson[]; progress: CollocationProgress; onProgressChange: (next: CollocationProgress) => void }
type Screen = 'index' | 'cards' | 'end' | 'passage'

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
function cardsFor(lesson: CollocationLesson): Card[] {
  const entries = lesson.collocations.map(item => ({ ...item, lessonId: lesson.id, lesson: lesson.lesson, topic: lesson.title }))
  const phrases = new Set(entries.map(item => clean(item.phrase)))
  const reviews = lesson.review.filter(item => !phrases.has(clean(item.phrase))).map(item => ({ phrase: item.phrase, yue: item.yue ?? '', weak: '', frame: '', model: '', mistake: '', lessonId: lesson.id, lesson: lesson.lesson, topic: lesson.title }))
  return [...reviews, ...entries].map(item => ({ phrase: item.phrase, yue: item.yue ?? '', weak: item.weak ?? '', frame: item.frame ?? '', model: item.model ?? '', mistake: item.mistake ?? '', lessonId: item.lessonId, lesson: item.lesson, topic: item.topic }))
}
const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - .5)

export function Collocations({ lessons, progress, onProgressChange }: Props) {
  const [screen, setScreen] = useState<Screen>('index')
  const [selected, setSelected] = useState<CollocationLesson | null>(null)
  const [deck, setDeck] = useState<Card[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [learning, setLearning] = useState(0)

  const allCards = useMemo(() => lessons.flatMap(cardsFor), [lessons])
  const current = deck[index]

  const openLesson = (lesson: CollocationLesson, destination: 'cards' | 'passage') => {
    setSelected(lesson)
    onProgressChange({ ...progress, lastId: lesson.id, lastOpened: new Date().toISOString() })
    if (destination === 'cards') {
      setDeck(shuffled(cardsFor(lesson))); setIndex(0); setFlipped(false); setKnown(0); setLearning(0)
    }
    setScreen(destination)
  }
  const startAll = () => {
    setSelected(null); setDeck(shuffled(allCards)); setIndex(0); setFlipped(false); setKnown(0); setLearning(0); setScreen('cards')
  }
  const finish = () => {
    if (selected) onProgressChange({ ...progress, done: { ...progress.done, [selected.id]: true } })
    setScreen('end')
  }
  const answer = (knows: boolean) => {
    if (!current) return
    const stillLearning = { ...progress.stillLearning, [current.phrase]: !knows }
    if (knows) delete stillLearning[current.phrase]
    onProgressChange({ ...progress, stillLearning })
    if (knows) setKnown(n => n + 1); else setLearning(n => n + 1)
    setFlipped(false)
    if (!knows && index < deck.length - 1) {
      const next = [...deck]; next.splice(Math.min(next.length, index + 2 + Math.floor(Math.random() * Math.max(1, next.length - index - 1))), 0, current); setDeck(next)
    }
    if (index + 1 >= deck.length) finish()
    else setIndex(index + 1)
  }
  useEffect(() => {
    if (screen !== 'cards') return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); answer(true) }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); answer(false) }
      else if ((event.key === ' ' || event.key === 'Enter') && (event.target as HTMLElement).tagName !== 'BUTTON') { event.preventDefault(); setFlipped(value => !value) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (screen === 'cards' && current) return <main className="main-content cb-content" id="main">
    <button className="text-button" onClick={() => setScreen('index')}>← 返回課程目錄</button>
    <div className="page-intro cb-intro"><span className="eyebrow">COLLOCATION BANK · {selected ? `LESSON ${selected.lesson}` : 'ALL LESSONS'}</span><h1>{selected?.title ?? '全部搭配'}</h1><p>翻卡練習 · 目前第 {index + 1} / {deck.length} 張</p></div>
    <div className="cb-progress"><span style={{ width: `${Math.round(index / deck.length * 100)}%` }} /></div>
    <button className={`cb-flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped(v => !v)} aria-label="翻轉卡片">
      {!flipped ? <><span className="cb-card-kicker">{current.topic} · {current.lesson}</span><strong>{current.phrase}</strong><span className="cb-hint">點擊翻卡</span></> : <><span className="cb-card-kicker">粵語意思</span><strong className="cb-translation">{current.yue || '—'}</strong>{current.weak && <span className="cb-weak">弱寫法：{current.weak}</span>}{current.frame && <p><b>句型</b>　{current.frame}</p>}{current.model && <p className="cb-model">{current.model}</p>}{current.mistake && <p className="cb-mistake">留意：{current.mistake}</p>}</>}
    </button>
    <div className="cb-actions"><button className="secondary-button" onClick={() => answer(false)}>仍要複習 ←</button><button className="primary-button" onClick={() => answer(true)}>已掌握 →</button></div>
    <p className="cb-shortcut">← 仍要複習　·　→ 已掌握　·　空白鍵翻卡</p>
  </main>

  if (screen === 'end') return <main className="main-content cb-content" id="main"><span className="eyebrow">SESSION COMPLETE</span><h1 className="cb-end-title">練習完成 ✦</h1><p className="cb-lede">今次已掌握 {known} 張，仍需複習 {learning} 張。</p><div className="cb-actions"><button className="primary-button" onClick={() => setScreen('index')}>返回課程目錄</button><button className="secondary-button" onClick={startAll}>再練全部</button></div></main>

  if (screen === 'passage' && selected) return <main className="main-content cb-content" id="main"><button className="text-button" onClick={() => setScreen('index')}>← 返回課程目錄</button><div className="page-intro cb-intro"><span className="eyebrow">LESSON {selected.lesson} · {selected.date}</span><h1>{selected.title}</h1><p>{selected.theme}</p></div><article className="cb-passage"><span className="cb-card-kicker">READING PASSAGE</span><p>{selected.passage?.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p></article><div className="cb-actions"><button className="primary-button" onClick={() => openLesson(selected, 'cards')}>開始搭配卡片</button></div>{selected.tasks?.length ? <section className="cb-tasks"><h2>Passage tasks</h2>{selected.tasks.map((task, i) => <details key={i}><summary>{i + 1}. {task.q}</summary><p>{task.answer ?? '請用自己的說話作答。'}</p></details>)}</section> : null}</main>

  return <main className="main-content cb-content" id="main">
    <div className="page-intro cb-intro"><span className="eyebrow">YOUR COLLOCATION BANK</span><h1>搭配詞練習</h1><p>每日幾分鐘，累積更自然、更精準的英文表達。</p></div>
    <section className="cb-hero"><div><span className="cb-card-kicker">COLLOCATION BANK</span><h2>{lessons.length} 篇課堂，循序累積表達力</h2><p>從搭配卡片到閱讀練習，按自己的節奏溫習。</p></div><button className="primary-button" onClick={startAll}>練習全部搭配 →</button></section>
    <div className="cb-list-heading"><div><span className="eyebrow">LESSON LIBRARY</span><h2>課堂目錄</h2></div><span>{Object.values(progress.done).filter(Boolean).length} / {lessons.length} 已完成</span></div>
    <div className="cb-lesson-list">{lessons.map(lesson => <article className="cb-lesson" key={lesson.id}><div className="cb-lesson-no">{String(lesson.lesson).padStart(2, '0')}</div><div className="cb-lesson-info"><span>{lesson.date} · {lesson.collocations.length} 個搭配</span><h3>{lesson.title}</h3><p>{lesson.theme}</p></div><span className={`cb-status ${progress.done[lesson.id] ? 'is-done' : ''}`}>{progress.done[lesson.id] ? '✓ 已完成' : progress.lastId === lesson.id ? '最近開啟' : '未開始'}</span><div className="cb-lesson-actions"><button onClick={() => openLesson(lesson, 'cards')}>卡片</button>{lesson.passage && <button onClick={() => openLesson(lesson, 'passage')}>閱讀</button>}</div></article>)}</div>
  </main>
}
