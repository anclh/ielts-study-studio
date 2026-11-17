import { useState } from 'react'
import { answerIsCorrect, completePracticeSet, getPracticeSet, type Level, type PracticeQuestion, type Progress, type QuestionType, type Skill } from './model'

interface Props {
  questions: PracticeQuestion[]
  progress: Progress
  onProgressChange: (progress: Progress) => void
}

const typeNames: Record<QuestionType, string> = {
  'true-false-not-given': '判斷題',
  'reading-gap': '閱讀填空',
  'listening-choice': '聽力選擇',
  'listening-gap': '聽力填空',
}
const types: Record<Skill, QuestionType[]> = {
  reading: ['true-false-not-given', 'reading-gap'],
  listening: ['listening-choice', 'listening-gap'],
}

export function Practice({ questions, progress, onProgressChange }: Props) {
  const [skill, setSkill] = useState<Skill>('reading')
  const [type, setType] = useState<QuestionType>('true-false-not-given')
  const [level, setLevel] = useState<Level>('B1')
  const [set, setSet] = useState<PracticeQuestion[] | null>(null)
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<{ question: PracticeQuestion; answer: string; correct: boolean }[]>([])
  const [showTranscript, setShowTranscript] = useState(false)
  const speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window

  const pickSkill = (next: Skill) => {
    setSkill(next)
    setType(types[next][0])
    setLevel('B1')
  }
  const pickType = (next: QuestionType) => {
    setType(next)
    setLevel('B1')
  }
  const start = () => {
    const matching = questions.filter(question => question.skill === skill && question.type === type && question.level === level)
    const completed = progress.practiceSets.filter(result => result.skill === skill && result.type === type && result.level === level).length
    const offset = (completed % Math.max(1, Math.floor(matching.length / 5))) * 5
    const chosen = getPracticeSet(matching.slice(offset), skill, type, level)
    if (chosen.length < 5) return
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
    window.speechSynthesis?.cancel()
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
      <div className="result-hero"><div className="score-ring"><strong>{score}<small>/ 5</small></strong><span>答對題數</span></div><div><span className="eyebrow">本次結果</span><h2>{score >= 4 ? '做得很好，繼續保持！' : '慢慢來，重點是看懂每一題。'}</h2><p>這是短題練習結果，不是雅思正式成績。</p></div></div>
      <div className="review-list">{answers.map((item, i) => <article className="review-card" key={item.question.id}><span className={`status ${item.correct ? 'status--good' : 'status--review'}`}>{item.correct ? '答對' : '再複習'}</span><h3>{String(i + 1).padStart(2, '0')}. {item.question.prompt}</h3><p>你的答案：<strong>{item.answer}</strong>　正確答案：<strong>{item.question.answer}</strong></p><p className="muted">{item.question.explanation}</p></article>)}</div>
      <button className="primary-button" onClick={() => setSet(null)}>再選一組練習 <span aria-hidden="true">↗</span></button>
    </main>
  }

  if (current) {
    return <main className="main-content" id="main"><div className="session-top"><button className="text-button" onClick={() => { window.speechSynthesis?.cancel(); setSet(null) }}>← 返回選題</button><span>{skill === 'reading' ? '閱讀' : '聽力'} · {typeNames[type]}</span></div>
      <div className="session-progress"><div><span>第 {index + 1} 題，共 5 題</span><strong>{Math.round(index / 5 * 100)}% 完成</strong></div><div className="progress-track"><span style={{ width: `${index / 5 * 100}%` }} /></div></div>
      <section className="question-card"><span className="eyebrow">QUESTION {String(index + 1).padStart(2, '0')} / 05</span><h1>{current.prompt}</h1>
        {current.passage && <div className="source-box"><div className="source-heading"><span>閱讀短文</span><span>READING PASSAGE</span></div><p>{current.passage}</p></div>}
        {current.transcript && <div className="audio-box"><div className="audio-icon" aria-hidden="true">♫</div><div><strong>聽力短句</strong><p>播放後選擇或填寫答案。可重播。</p></div><button className="secondary-button" type="button" onClick={() => speak(current.transcript!)}>{speechAvailable ? '▶ 播放語音' : '無語音可用'}</button></div>}
        {current.transcript && <div className="transcript-control"><button className="text-button" type="button" onClick={() => setShowTranscript(!showTranscript)} aria-expanded={showTranscript}>{showTranscript ? '隱藏文字稿' : '顯示文字稿'}</button>{showTranscript && <div className="transcript">{current.transcript}</div>}</div>}
        <div className="answer-area"><div className="field-label">你的答案</div>{current.options ? <div className="option-list" role="radiogroup" aria-label="答案選項">{current.options.map(option => <label className={`option ${answer === option ? 'option--selected' : ''}`} key={option}><input type="radio" name="answer" value={option} checked={answer === option} disabled={submitted} onChange={() => setAnswer(option)} /><span className="radio-dot" />{option}</label>)}</div> : <input className="answer-input" value={answer} disabled={submitted} onChange={event => setAnswer(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') submit() }} placeholder="在這裡輸入答案" aria-label="你的答案" />}</div>
        {submitted && <div className={`feedback ${answerIsCorrect(current, answer) ? 'feedback--good' : 'feedback--review'}`} role="status"><strong>{answerIsCorrect(current, answer) ? '答對了！' : `再看看：正確答案是 ${current.answer}`}</strong><p>{current.explanation}</p></div>}
        <div className="question-actions">{submitted ? <button className="primary-button" onClick={next}>{index === 4 ? '看本次結果' : '下一題'} <span aria-hidden="true">→</span></button> : <button className="primary-button" onClick={submit} disabled={!answer.trim()}>送出答案 <span aria-hidden="true">→</span></button>}</div>
      </section>
      <p className="fine-print">聽力使用裝置語音朗讀的原創示範題，文字稿可隨時查看。</p>
    </main>
  }

  const available = questions.filter(question => question.skill === skill && question.type === type && question.level === level).length
  return <main className="main-content" id="main"><div className="page-intro"><span className="eyebrow">FOCUSED PRACTICE</span><h1>挑一種題型，<br /><em>練出自己的節奏。</em></h1><p>一次 5 題，聽力與閱讀分開練。每題完成後立即看詳解。</p></div>
    <div className="practice-layout"><section className="panel picker-panel"><div className="section-title"><span className="step-number">01</span><div><h2>今天想練哪一科？</h2><p>選好科目，再挑一種題型。</p></div></div>
      <div className="skill-grid"><button className={`skill-card skill-card--reading ${skill === 'reading' ? 'skill-card--active' : ''}`} onClick={() => pickSkill('reading')} aria-pressed={skill === 'reading'}><span className="skill-symbol">▤</span><strong>閱讀 Reading</strong><small>看短文，抓關鍵線索</small></button><button className={`skill-card skill-card--listening ${skill === 'listening' ? 'skill-card--active' : ''}`} onClick={() => pickSkill('listening')} aria-pressed={skill === 'listening'}><span className="skill-symbol">◖))</span><strong>聽力 Listening</strong><small>聽重點，練聽答反應</small></button></div>
      <div className="divider" /><div className="section-title"><span className="step-number">02</span><div><h2>選擇題型</h2><p>每一組都是短題練習。</p></div></div><div className="type-grid">{types[skill].map(item => <button key={item} className={`type-button ${type === item ? 'type-button--active' : ''}`} onClick={() => pickType(item)} aria-pressed={type === item}><span>{typeNames[item]}</span><span aria-hidden="true">↗</span></button>)}</div>
      <div className="divider" /><div className="section-title"><span className="step-number">03</span><div><h2>選擇程度</h2><p>從適合自己的難度開始。</p></div></div><div className="level-row">{(['B1', 'B2'] as Level[]).map(item => <button key={item} className={`level-chip ${level === item ? 'level-chip--active' : ''}`} onClick={() => setLevel(item)} aria-pressed={level === item}>{item} <small>{item === 'B1' ? '基礎進階' : '中高階'}</small></button>)}</div>
    </section><aside className="start-panel"><div className="start-art" aria-hidden="true"><span className="art-orbit art-orbit--one" /><span className="art-orbit art-orbit--two" /><span className="art-letter">{skill === 'reading' ? 'R' : 'L'}</span><span className="art-spark">✦</span></div><span className="eyebrow">YOUR NEXT SET</span><h2>{skill === 'reading' ? '閱讀' : '聽力'} · {typeNames[type]}</h2><p>5 題 · {level} 程度 · 即時詳解</p><div className="start-spacer" /><div className="available-note">{available >= 5 ? '這組題目準備好了' : '這個程度目前沒有完整的 5 題，請選其他程度。'}</div><button className="primary-button primary-button--wide" onClick={start} disabled={available < 5}>開始練習 <span aria-hidden="true">→</span></button></aside></div>
    <p className="fine-print">這裡的原創短題適合熟悉題型，並非完整雅思模擬考。</p>
  </main>
}
