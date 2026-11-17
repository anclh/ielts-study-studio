import { useState } from 'react'
import { Practice } from './Practice'
import { Words } from './Words'
import { Productive } from './Productive'
import { Collocations } from './CollocationSection'
import { collocationLessons } from './collocations'
import { loadBrowserCollocationProgress, saveBrowserCollocationProgress, type CollocationProgress } from './collocationStorage'
import { practiceQuestions } from './content/practice'
import { words } from './content/words'
import { loadBrowserProgress, saveBrowserProgress } from './storage'
import { type Progress } from './model'

type Page = 'practice' | 'words' | 'collocations' | 'speaking' | 'writing'

export default function App() {
  const [page, setPage] = useState<Page>('practice')
  const [progress, setProgress] = useState<Progress>(() => loadBrowserProgress(window))
  const [collocationProgress, setCollocationProgress] = useState<CollocationProgress>(() => loadBrowserCollocationProgress(window))
  const updateProgress = (next: Progress) => {
    setProgress(next)
    saveBrowserProgress(window, next)
  }
  const updateCollocationProgress = (next: CollocationProgress) => {
    setCollocationProgress(next)
    saveBrowserCollocationProgress(window, next)
  }

  return <div className="app-shell">
    <a className="skip-link" href="#main">跳到主要內容</a>
    <header className="site-header"><div className="header-inner"><button className="brand" onClick={() => setPage('practice')} aria-label="IELTS 練習室，前往練習"><span className="brand-mark">i<span>.</span></span><span className="brand-words"><strong>IELTS 練習室</strong><small>YOUR DAILY STUDY SPACE</small></span></button><nav className="desktop-nav" aria-label="主要導覽"><button className={page === 'practice' ? 'nav-active' : ''} onClick={() => setPage('practice')} aria-current={page === 'practice' ? 'page' : undefined}>練習 Practice</button><button className={page === 'words' ? 'nav-active' : ''} onClick={() => setPage('words')} aria-current={page === 'words' ? 'page' : undefined}>單字 Words</button><button className={page === 'collocations' ? 'nav-active' : ''} onClick={() => setPage('collocations')} aria-current={page === 'collocations' ? 'page' : undefined}>搭配 Collocations</button><button className={page === 'speaking' ? 'nav-active' : ''} onClick={() => setPage('speaking')}>口語 Speaking</button><button className={page === 'writing' ? 'nav-active' : ''} onClick={() => setPage('writing')}>寫作 Writing</button></nav><div className="header-right"><span className="header-label">LEARN AT YOUR PACE</span><span className="header-star" aria-hidden="true">✳</span></div></div></header>
    <div className="page-wrap"><aside className="side-rail" aria-label="學習進度"><div className="rail-line" /><span className="rail-label">STUDY NOTES / 01</span><div className="rail-block"><span className="rail-number">{String(progress.practiceAttempts.length).padStart(2, '0')}</span><span>已練題數</span></div><div className="rail-block"><span className="rail-number">{String(Object.values(progress.wordStreaks).filter(count => count >= 3).length).padStart(2, '0')}</span><span>已熟單字</span></div><div className="rail-block"><span className="rail-number">{String(Object.values(collocationProgress.done).filter(Boolean).length).padStart(2, '0')}</span><span>完成搭配課</span></div><div className="rail-message">每天一點點，<br />就會走得很遠。<span aria-hidden="true">✦</span></div></aside>
      {page === 'practice' ? <Practice questions={practiceQuestions} progress={progress} onProgressChange={updateProgress} /> : page === 'words' ? <Words words={words} progress={progress} onProgressChange={updateProgress} /> : page === 'collocations' ? <Collocations lessons={collocationLessons} progress={collocationProgress} onProgressChange={updateCollocationProgress} /> : <Productive key={page} mode={page} />}
    </div>
    <footer className="site-footer"><span>IELTS 練習室 · 原創示範題</span><span>練習在這裡，進步在每天。</span></footer>
    <nav className="mobile-nav" aria-label="手機導覽"><button className={page === 'practice' ? 'nav-active' : ''} onClick={() => setPage('practice')} aria-current={page === 'practice' ? 'page' : undefined}><span aria-hidden="true">▤</span>練習</button><button className={page === 'words' ? 'nav-active' : ''} onClick={() => setPage('words')} aria-current={page === 'words' ? 'page' : undefined}><span aria-hidden="true">✳</span>單字</button><button className={page === 'collocations' ? 'nav-active' : ''} onClick={() => setPage('collocations')} aria-current={page === 'collocations' ? 'page' : undefined}><span aria-hidden="true">Aa</span>搭配</button><button className={page === 'speaking' ? 'nav-active' : ''} onClick={() => setPage('speaking')}><span aria-hidden="true">◉</span>口語</button><button className={page === 'writing' ? 'nav-active' : ''} onClick={() => setPage('writing')}><span aria-hidden="true">✎</span>寫作</button></nav>
  </div>
}
