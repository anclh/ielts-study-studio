import { useEffect, useState } from 'react'
import { answerIsCorrect, completePracticeSet, getPracticeSet, type Level, type PracticeQuestion, type Progress, type QuestionType, type Skill } from './model'

interface Props {
  skill: Skill
  questions: PracticeQuestion[]
  progress: Progress
  onProgressChange: (progress: Progress) => void
}

const typeNames: Record<QuestionType, string> = {
  'true-false-not-given': '判斷題',
  'reading-gap': '閱讀填空',
  'reading-mini': '迷你測驗 · 混合題型',
  'listening-choice': '聽力選擇',
  'listening-gap': '聽力填空',
  'listening-mini': '迷你測驗 · 混合題型',
}
const types: Record<Skill, QuestionType[]> = {
  reading: ['reading-mini', 'true-false-not-given', 'reading-gap'],
  listening: ['listening-mini', 'listening-choice', 'listening-gap'],
}

export function Practice({ skill, questions, progress, onProgressChange }: Props) {
  const [type, setType] = useState<QuestionType>(types[skill][0])
  const [level, setLevel] = useState<Level>('B1')
  const [selectedSet, setSelectedSet] = useState<number | null>(null)
  const [set, setSet] = useState<PracticeQuestion[] | null>(null)
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<{ question: PracticeQuestion; answer: string; correct: boolean }[]>([])
  const [showTranscript, setShowTranscript] = useState(false)
  useEffect(() => () => window.speechSynthesis?.cancel(), [])
  const speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window

  const pickType = (next: QuestionType) => {
    setType(next)
    setLevel('B1')
    setSelectedSet(null)
  }
  const matching = questions.filter(question => question.skill === skill && question.type === type && question.level === level)
  const setSize = type === 'reading-mini' || type === 'listening-mini' ? 10 : 5
  const setCount = Math.floor(matching.length / setSize)
  const completed = progress.practiceSets.filter(result => result.skill === skill && result.type === type && result.level === level).length
  const activeSet = selectedSet ?? completed % Math.max(1, setCount)
  const start = () => {
    const offset = activeSet * setSize
    const chosen = getPracticeSet(matching.slice(offset), skill, type, level, setSize)
    if (chosen.length < setSize) return
    setSet(chosen)
    setIndex(0)
    setAnswer('')
    setSubmitted(false)
    setAnswers([])
    setShowTranscript(!speechAvailable)
  }
  const current = set?.[index]
  const finished = !!set && index >= set.length

  const submit = () => {
    if (!current || !answer.trim() || submitted) return
    const correct = answerIsCorrect(current, answer)
    const next = { question: current, answer: answer.trim(), correct }
    setAnswers([...answers, next])
    onProgressChange({ ...progress, practiceAttempts: [...progress.practiceAttempts, { questionId: current.id, answer: answer.trim(), correct, at: new Date().toISOString() }] })
    setSubmitted(true)
  }
  const next = () => {
    if (!set || !submitted) return
    if (index === set.length - 1) onProgressChange(completePracticeSet(progress, set, answers.map(item => item.correct), new Date().toISOString()))
    setIndex(index + 1)
    setAnswer('')
    setSubmitted(false)
    setShowTranscript(!speechAvailable)
    if (!current?.transcript || set[index + 1]?.transcript !== current.transcript) window.speechSynthesis?.cancel()
  }
  const speak = (text: string) => {
    if (!speechAvailable) { setShowTranscript(true); return }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-GB'
    utterance.rate = 0.88
    utterance.onerror = () => setShowTranscript(true)
    window.speechSynthesis.speak(utterance)
  }

  if (finished) {
    const score = answers.filter(item => item.correct).length
    return <main className="main-content" id="main"><div className="page-intro"><span className="eyebrow">PRACTICE COMPLETE</span><h1>這組完成了。</h1><p>每一題都是離目標更近的一步。回頭看看答題重點吧。</p></div>
      <div className="result-hero"><div className="score-ring"><strong>{score}<small>/ {setSize}</small></strong><span>答對題數</span></div><div><span className="eyebrow">本次結果</span><h2>{score >= Math.ceil(setSize * 0.8) ? '做得很好，繼續保持！' : '慢慢來，重點是看懂每一題。'}</h2><p>這是短題練習結果，不是雅思正式成績。</p></div></div>
      <div className="review-list">{answers.map((item, i) => <article className="review-card" key={item.question.id}><span className={`status ${item.correct ? 'status--good' : 'status--review'}`}>{item.correct ? '答對' : '再複習'}</span><h3>{String(i + 1).padStart(2, '0')}. {item.question.prompt}</h3><p>你的答案：<strong>{item.answer}</strong>　正確答案：<strong>{item.question.answer}</strong></p><p className="muted">{item.question.explanation}</p></article>)}</div>
      <button className="primary-button" onClick={() => { setSelectedSet(null); setSet(null) }}>再選一組練習 <span aria-hidden="true">↗</span></button>
    </main>
  }

  if (current) {
    return <main className="main-content" id="main"><div className="session-top"><button className="text-button" onClick={() => { window.speechSynthesis?.cancel(); setSet(null) }}>← 返回選題</button><span>{skill === 'reading' ? '閱讀' : '聽力'} · {typeNames[type]}</span></div>
      <div className="session-progress"><div><span>第 {index + 1} 題，共 {setSize} 題</span><strong>{Math.round(index / setSize * 100)}% 完成</strong></div><div className="progress-track"><span style={{ width: `${index / setSize * 100}%` }} /></div></div>
      <section className="question-card"><span className="eyebrow">QUESTION {String(index + 1).padStart(2, '0')} / {String(setSize).padStart(2, '0')}</span><h1>{current.prompt}</h1>
        {current.passage && <div className="source-box"><div className="source-heading"><span>閱讀短文</span><span>READING PASSAGE</span></div><div lang="en">{current.passage.split('\n\n').map(paragraph => <p key={paragraph} style={{ marginBottom: 12 }}>{paragraph}</p>)}</div></div>}
        {current.transcript && <div className="audio-box"><div className="audio-icon" aria-hidden="true">♫</div><div><strong>聽力練習</strong><p>{type === 'listening-mini' ? '全組共用同一段語音。播放器會繼續播放，亦可從頭重播。' : '播放後選擇或填寫答案。可重播。'}</p></div><button className="secondary-button" type="button" onClick={() => speak(current.transcript!)}>{speechAvailable ? '▶ 播放語音' : '無語音可用'}</button></div>}
        {current.transcript && <div className="transcript-control"><button className="text-button" type="button" onClick={() => setShowTranscript(!showTranscript)} aria-expanded={showTranscript}>{showTranscript ? '隱藏文字稿' : '顯示文字稿'}</button>{showTranscript && <div className="transcript">{current.transcript}</div>}</div>}
        <div className="answer-area"><div className="field-label">你的答案</div>{current.options ? <div className="option-list" role="radiogroup" aria-label="答案選項">{current.options.map(option => <label className={`option ${answer === option ? 'option--selected' : ''}`} key={option}><input type="radio" name="answer" value={option} checked={answer === option} disabled={submitted} onChange={() => setAnswer(option)} /><span className="radio-dot" />{option}</label>)}</div> : <input className="answer-input" value={answer} disabled={submitted} onChange={event => setAnswer(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') submit() }} placeholder="在這裡輸入答案" aria-label="你的答案" />}</div>
        {submitted && <div className={`feedback ${answerIsCorrect(current, answer) ? 'feedback--good' : 'feedback--review'}`} role="status"><strong>{answerIsCorrect(current, answer) ? '答對了！' : `再看看：正確答案是 ${current.answer}`}</strong><p>{current.explanation}</p></div>}
        <div className="question-actions">{submitted ? <button className="primary-button" onClick={next}>{index === setSize - 1 ? '看本次結果' : '下一題'} <span aria-hidden="true">→</span></button> : <button className="primary-button" onClick={submit} disabled={!answer.trim()}>送出答案 <span aria-hidden="true">→</span></button>}</div>
      </section>
      {skill === 'listening' && <p className="fine-print">聽力使用裝置語音朗讀，文字稿可隨時查看。</p>}
    </main>
  }

  const available = matching.length
  const isReading = skill === 'reading'
  return <main className="main-content" id="main">
    <div className="page-intro">
      <h1>{isReading ? '閱讀 Reading' : '聽力 Listening'}</h1>
      <p>{isReading ? '閱讀短文，找出支持答案的線索。' : '播放語音，練習辨認重點和細節。'} 選擇 10 題迷你測驗或 5 題分類練習。</p>
    </div>
    <div className="practice-layout">
      <section className="panel picker-panel">
        <div className="section-title"><div><h2>選擇題型</h2></div></div>
        <div className="type-grid">{types[skill].map(item => <button key={item} className={`type-button ${type === item ? 'type-button--active' : ''}`} onClick={() => pickType(item)} aria-pressed={type === item}><span>{typeNames[item]}</span><span aria-hidden="true">↗</span></button>)}</div>
      <div className="divider" /><div className="section-title"><div><h2>選擇程度</h2><p>從適合自己的難度開始。</p></div></div><div className="level-row">{(['B1', 'B2'] as Level[]).map(item => <button key={item} className={`level-chip ${level === item ? 'level-chip--active' : ''}`} onClick={() => { setLevel(item); setSelectedSet(null) }} aria-pressed={level === item}>{item} <small>{item === 'B1' ? '基礎進階' : '中高階'}</small></button>)}</div>
    </section><aside className="start-panel"><div className="start-art" aria-hidden="true"><span className="art-orbit art-orbit--one" /><span className="art-orbit art-orbit--two" /><span className="art-letter">{skill === 'reading' ? 'R' : 'L'}</span><span className="art-spark">✦</span></div><span className="eyebrow">YOUR NEXT SET</span><h2>{skill === 'reading' ? '閱讀' : '聽力'} · {typeNames[type]}</h2><p>{setSize} 題 · {level} 程度 · 即時詳解</p>{setCount > 1 && <div className="level-row" aria-label="選擇練習組別">
      {Array.from({ length: setCount }, (_, number) => <button key={number} className={`level-chip ${activeSet === number ? 'level-chip--active' : ''}`} aria-pressed={activeSet === number} onClick={() => setSelectedSet(number)}>第 {number + 1} 組</button>)}
    </div>}<div className="start-spacer" /><div className="available-note">{available >= setSize ? '這組題目準備好了' : '這個程度目前沒有完整題組，請選其他程度。'}</div><button className="primary-button primary-button--wide" onClick={start} disabled={available < setSize}>開始練習 <span aria-hidden="true">→</span></button></aside></div>
    <p className="fine-print">這裡的原創短題適合熟悉題型，並非完整雅思模擬考。</p>
  </main>
}
