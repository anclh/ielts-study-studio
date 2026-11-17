import { useState } from 'react'
import { getReviewWords, markWordRecall, recordWordAnswer, wordStatus, type Progress, type Word } from './model'
import { topicNames } from './content/words'

interface Props {
  words: Word[]
  progress: Progress
  onProgressChange: (progress: Progress) => void
}
type Stage = 'topics' | 'cards' | 'quiz' | 'done' | 'saved'
const statusNames = { new: '新字', review: '待複習', learning: '學習中', mastered: '已熟' }

export function Words({ words, progress, onProgressChange }: Props) {
  const [stage, setStage] = useState<Stage>('topics')
  const [round, setRound] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [choice, setChoice] = useState('')
  const [checked, setChecked] = useState(false)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [roundName, setRoundName] = useState('')
  const speechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window

  const start = (selected: Word[], name: string) => {
    if (!selected.length) return
    setRound(selected.slice(0, 10))
    setRoundName(name)
    setIndex(0)
    setRevealed(false)
    setChoice('')
    setChecked(false)
    setRoundCorrect(0)
    setStage('cards')
  }
  const speak = (term: string) => {
    if (!speechAvailable) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(term)
    utterance.lang = 'en-GB'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }
  const toggleSaved = (id: string) => {
    const savedWords = progress.savedWords.includes(id) ? progress.savedWords.filter(item => item !== id) : [...progress.savedWords, id]
    onProgressChange({ ...progress, savedWords })
  }
  const advanceCard = (remembered: boolean) => {
    onProgressChange(markWordRecall(progress, current.id, remembered))
    if (index + 1 < round.length) { setIndex(index + 1); setRevealed(false) }
    else { setStage('quiz'); setIndex(0) }
  }
  const checkAnswer = () => {
    if (!choice || checked) return
    const correct = choice === round[index].meaning
    onProgressChange(recordWordAnswer(progress, round[index].id, correct))
    if (correct) setRoundCorrect(roundCorrect + 1)
    setChecked(true)
  }
  const nextQuiz = () => {
    if (!checked) return
    if (index + 1 < round.length) { setIndex(index + 1); setChoice(''); setChecked(false) }
    else setStage('done')
  }
  const current = round[index]
  const quizOptions = current ? [current.meaning, ...words.filter(word => word.id !== current.id && word.topic === current.topic).slice((index * 3) % 7, (index * 3) % 7 + 3).map(word => word.meaning)].sort((a, b) => a.localeCompare(b, 'zh-Hant')) : []
  const saved = words.filter(word => progress.savedWords.includes(word.id))
  const review = getReviewWords(words, progress)

  if (stage === 'cards' && current) return <main className="main-content" id="main"><div className="session-top"><button className="text-button" onClick={() => setStage('topics')}>← 返回單字</button><span>{roundName} · 翻卡</span></div><div className="session-progress"><div><span>第 {index + 1} 個，共 {round.length} 個</span><strong>先認識，再測驗</strong></div><div className="progress-track progress-track--gold"><span style={{ width: `${index / round.length * 100}%` }} /></div></div>
    <div className="word-session"><div className="word-card"><div className="word-card-top"><span className="eyebrow">FLASH CARD {String(index + 1).padStart(2, '0')}</span><button className="save-button" onClick={() => toggleSaved(current.id)} aria-pressed={progress.savedWords.includes(current.id)}>{progress.savedWords.includes(current.id) ? '★ 已收藏' : '☆ 收藏'}</button></div><div className="word-centre"><span className="word-topic">{roundName} · {statusNames[wordStatus(progress, current.id)]}</span><h1>{current.term}</h1><button className="pronounce-button" onClick={() => speak(current.term)} disabled={!speechAvailable}>♫ {speechAvailable ? '聽發音' : '此裝置無語音'}</button></div>{revealed ? <div className="word-reveal"><strong>{current.meaning}</strong><span>{current.partOfSpeech}</span><p>{current.example}</p></div> : <button className="reveal-button" onClick={() => setRevealed(true)}>翻開看意思 <span aria-hidden="true">↓</span></button>}</div><div className="word-session-actions"><p>看完意思後，標記是否記得。</p><div className="recall-actions"><button className="secondary-button" onClick={() => advanceCard(false)} disabled={!revealed}>還不熟</button><button className="primary-button" onClick={() => advanceCard(true)} disabled={!revealed}>記得了 <span aria-hidden="true">→</span></button></div></div></div></main>

  if (stage === 'quiz' && current) return <main className="main-content" id="main"><div className="session-top"><button className="text-button" onClick={() => setStage('topics')}>← 返回單字</button><span>{roundName} · 小測驗</span></div><div className="session-progress"><div><span>第 {index + 1} 題，共 {round.length} 題</span><strong>{roundCorrect} 題答對</strong></div><div className="progress-track progress-track--gold"><span style={{ width: `${index / round.length * 100}%` }} /></div></div><section className="question-card word-quiz"><span className="eyebrow">WORD QUIZ · {String(index + 1).padStart(2, '0')} · {statusNames[wordStatus(progress, current.id)]}</span><p className="quiz-kicker">選出這個英文單字的意思</p><h1>{current.term}</h1><button className="pronounce-button" onClick={() => speak(current.term)} disabled={!speechAvailable}>♫ 聽發音</button><div className="option-list word-options" role="radiogroup" aria-label="單字意思">{quizOptions.map(option => <label className={`option ${choice === option ? 'option--selected' : ''}`} key={option}><input type="radio" name="word-answer" value={option} checked={choice === option} disabled={checked} onChange={() => setChoice(option)} /><span className="radio-dot" />{option}</label>)}</div>{checked && <div className={`feedback ${choice === current.meaning ? 'feedback--good' : 'feedback--review'}`} role="status"><strong>{choice === current.meaning ? '答對了！' : `答錯了，正確意思是「${current.meaning}」`}</strong><p>{choice === current.meaning ? '再答對幾次，就能把這個字練熟。' : '這個字已列入待複習，下次再試一次。'}</p><p className="example-line">{current.example}</p></div>}<div className="question-actions">{checked ? <button className="primary-button" onClick={nextQuiz}>{index + 1 === round.length ? '看這組結果' : '下一個字'} →</button> : <button className="primary-button" onClick={checkAnswer} disabled={!choice}>確認答案 →</button>}</div></section></main>

  if (stage === 'done') return <main className="main-content" id="main"><div className="page-intro"><span className="eyebrow">WORDS COMPLETE</span><h1>這組單字，<em>收進腦袋了。</em></h1><p>隔一段時間再練一次，記憶會更牢固。</p></div><div className="result-hero result-hero--gold"><div className="score-ring"><strong>{roundCorrect}<small>/ {round.length}</small></strong><span>答對單字</span></div><div><span className="eyebrow">{roundName}</span><h2>做得好，今天又前進了一點。</h2><p>連續答對 3 次的字會標記為已熟；答錯會回到待複習。</p></div></div><div className="done-actions"><button className="primary-button" onClick={() => start(round, roundName)}>再刷這組 →</button><button className="secondary-button" onClick={() => setStage('topics')}>回單字主題</button></div></main>

  if (stage === 'saved') return <main className="main-content" id="main"><div className="session-top"><button className="text-button" onClick={() => setStage('topics')}>← 返回單字</button></div><div className="page-intro"><span className="eyebrow">MY WORDS</span><h1>我的收藏</h1><p>把想再看的字留在這裡。</p></div>{saved.length ? <div className="saved-grid">{saved.map(word => <article className="saved-card" key={word.id}><span className="eyebrow">{topicNames[word.topic]} · {statusNames[wordStatus(progress, word.id)]}</span><h2>{word.term}</h2><p>{word.meaning} <span className="muted">· {word.partOfSpeech}</span></p><p className="muted">{word.example}</p><button className="text-button" onClick={() => toggleSaved(word.id)}>移出收藏</button></article>)}</div> : <div className="empty-state">還沒有收藏的字。翻單字卡時按「收藏」就會出現在這裡。</div>}</main>

  return <main className="main-content" id="main"><div className="page-intro"><span className="eyebrow">THE WORD STUDIO</span><h1>一點一點，<br /><em>把單字變熟悉。</em></h1><p>按主題學習，每回約 10 個字。先翻卡，再用小測驗確認自己記得多少。</p></div><div className="words-summary"><div><span className="summary-icon">✳</span><strong>{words.filter(word => wordStatus(progress, word.id) === 'mastered').length}<small> / {words.length}</small></strong><span>已熟單字</span></div><div><span className="summary-icon">↺</span><strong>{review.length}</strong><span>還不熟的字</span></div><button onClick={() => start(review.slice(0, 10), '複習還不熟的字')} disabled={!review.length}><span>↗</span><strong>複習還不熟的字</strong><small>{review.length ? `從 ${review.length} 個字挑一組` : '目前沒有待複習的字'}</small></button></div><div className="section-heading"><div><span className="eyebrow">EXPLORE TOPICS</span><h2>挑一個主題開始</h2></div><button className="text-button" onClick={() => setStage('saved')}>我的收藏 ({saved.length}) →</button></div><div className="topic-grid">{Object.entries(topicNames).map(([id, name], i) => { const topicWords = words.filter(word => word.topic === id); const mastered = topicWords.filter(word => wordStatus(progress, word.id) === 'mastered').length; return <button key={id} className={`topic-card topic-card--${i}`} onClick={() => start(topicWords, name)}><span className="topic-number">0{i + 1} / TOPIC</span><span className="topic-glyph" aria-hidden="true">{['◒', '✳', '▥'][i]}</span><h3>{name}</h3><p>{['從氣候到自然資源，理解常見議題。', '從課堂到研究，累積學術常用字。', '從交通到公共空間，描寫城市生活。'][i]}</p><div className="topic-footer"><span>{mastered} / {topicWords.length} 已熟</span><strong>開始學習 ↗</strong></div></button> })}</div><p className="fine-print">發音使用裝置語音功能。學習進度儲存在此瀏覽器。</p></main>
}
