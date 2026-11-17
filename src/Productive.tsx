import { useEffect, useState } from 'react'

type Prompt = { id: string; label: string; text: string; minutes: number; target?: number }
const speaking: Prompt[] = [
  { id: 's1', label: 'Part 1 · Daily life', text: 'What do you enjoy doing in your neighbourhood? Has the area changed since you first knew it?', minutes: 2 },
  { id: 's2', label: 'Part 2 · Long turn', text: 'Describe a skill you learned outside school. Say what it is, how you learned it, and explain how it has helped you.', minutes: 2 },
  { id: 's3', label: 'Part 3 · Discussion', text: 'How can communities encourage people of different ages to learn from one another? What challenges might they face?', minutes: 4 },
]
const writing: Prompt[] = [
  { id: 'w1', label: 'General Training · Task 1', text: 'A local library has reduced its opening hours. Write a letter to the library manager explaining how the change affects you, suggesting an alternative and offering to help.', minutes: 20, target: 150 },
  { id: 'w2', label: 'Academic · Task 1', text: 'A town survey found that 40% of residents travelled to work by bus in 2015 and 55% in 2025. Car use fell from 45% to 30%, while cycling remained at 15%. Summarise the main features and make relevant comparisons.', minutes: 20, target: 150 },
  { id: 'w3', label: 'Task 2 · Discussion', text: 'Some people believe public spaces should be designed mainly for exercise, while others think they should provide places for quiet activities. Discuss both views and give your opinion.', minutes: 40, target: 250 },
]
export function Productive({ mode }: { mode: 'speaking' | 'writing' }) {
  const prompts = mode === 'speaking' ? speaking : writing
  const [selected, setSelected] = useState(0)
  const [seconds, setSeconds] = useState(prompts[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, string>>(() => { try { return JSON.parse(localStorage.getItem('ielts-productive-drafts-v1') || '{}') } catch { return {} } })
  const prompt = prompts[selected]
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setSeconds(n => { if (n <= 1) { setRunning(false); return 0 } return n - 1 }), 1000); return () => clearInterval(timer) }, [running])
  const choose = (i: number) => { setSelected(i); setRunning(false); setSeconds(prompts[i].minutes * 60) }
  const save = (value: string) => { const next = { ...drafts, [prompt.id]: value }; setDrafts(next); try { localStorage.setItem('ielts-productive-drafts-v1', JSON.stringify(next)) } catch { /* storage unavailable */ } }
  const words = (drafts[prompt.id] || '').trim().split(/\s+/).filter(Boolean).length
  return <main className="main-content productive" id="main"><div className="page-intro"><span className="eyebrow">{mode === 'speaking' ? 'SPEAKING PRACTICE' : 'WRITING PRACTICE'}</span><h1>{mode === 'speaking' ? '開口說，慢慢更流利。' : '把想法寫清楚。'}</h1><p>{mode === 'speaking' ? '選一題，計時練習，然後記下想改善的地方。' : '選一題，計時寫作；草稿會儲存在這個瀏覽器。'}</p></div>
    <div className="productive-tabs">{prompts.map((item, i) => <button key={item.id} className={i === selected ? 'active' : ''} onClick={() => choose(i)}>{item.label}</button>)}</div>
    <section className="productive-card"><span className="eyebrow">{prompt.label}</span><h2>{prompt.text}</h2><div className="productive-timer"><strong>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</strong><button className="secondary-button" onClick={() => setRunning(!running)} disabled={seconds === 0}>{running ? '暫停' : '開始計時'}</button><button className="text-button" onClick={() => { setRunning(false); setSeconds(prompt.minutes * 60) }}>重設</button></div>{prompt.target && <p className="muted">建議最少 {prompt.target} 字 · {prompt.minutes} 分鐘</p>}</section>
    <section className="productive-editor"><label htmlFor="productive-draft">{mode === 'speaking' ? '練習筆記' : '你的答案'}</label><textarea id="productive-draft" value={drafts[prompt.id] || ''} onChange={event => save(event.target.value)} placeholder={mode === 'speaking' ? '記下例子、詞彙或下次想改善的地方…' : '在這裡開始寫作…'} /><p>{words} words · 草稿儲存在此瀏覽器</p></section>
    <aside className="productive-source"><strong>更多練習</strong><p>到 IELTS Online Tests 閱讀完整的 {mode === 'speaking' ? 'Speaking' : 'Writing'} 練習。</p><a href={mode === 'speaking' ? 'https://ieltsonlinetests.com/ielts-general-training-volume-1-speaking-practice-test-1' : 'https://ieltsonlinetests.com/ielts-practice-tests-plus-volume-2-writing-practice-test-1'} target="_blank" rel="noreferrer">開啟 IELTS Online Tests ↗</a></aside>
  </main>
}
