import { useState, useSyncExternalStore } from 'react'
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

const pages = [
  { id: 'reading', label: '閱讀', english: 'Reading', icon: '▤' },
  { id: 'listening', label: '聽力', english: 'Listening', icon: '♫' },
  { id: 'speaking', label: '口語', english: 'Speaking', icon: '◉' },
  { id: 'writing', label: '寫作', english: 'Writing', icon: '✎' },
  { id: 'words', label: '單字', english: 'Words', icon: '✳' },
  { id: 'collocations', label: '搭配', english: 'Collocation', icon: 'Aa' },
] as const

type Page = typeof pages[number]['id']

function getPage(): Page {
  return pages.find(({ id }) => window.location.hash === `#/${id}`)?.id ?? 'reading'
}

function subscribeToPage(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function Navigation({ page, mobile = false }: { page: Page; mobile?: boolean }) {
  return (
    <nav className={mobile ? 'mobile-nav' : 'desktop-nav'} aria-label={mobile ? '手機導覽' : '主要導覽'}>
      {pages.map(({ id, label, english, icon }) => (
        <a key={id} href={`#/${id}`} aria-current={page === id ? 'page' : undefined} className={page === id ? 'nav-active' : ''}>
          {mobile && <span aria-hidden="true">{icon}</span>}
          {mobile ? label : `${label} ${english}`}
        </a>
      ))}
    </nav>
  )
}

export default function App() {
  const page = useSyncExternalStore(subscribeToPage, getPage)
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
    <a className="skip-link" href="#main" onClick={event => {
      const main = document.getElementById('main')
      if (!main) return
      event.preventDefault()
      main.tabIndex = -1
      main.focus()
      main.scrollIntoView()
    }}>跳到主要內容</a>
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#/reading" aria-label="IELTS 練習室，前往閱讀">
          <span className="brand-mark">i<span>.</span></span>
          <span className="brand-words"><strong>IELTS 練習室</strong><small>YOUR DAILY STUDY SPACE</small></span>
        </a>
        <Navigation page={page} />
        <div className="header-right"><span className="header-label">LEARN AT YOUR PACE</span><span className="header-star" aria-hidden="true">✳</span></div>
      </div>
    </header>
    <div className="page-wrap"><aside className="side-rail" aria-label="學習進度"><div className="rail-line" /><span className="rail-label">STUDY NOTES / 01</span><div className="rail-block"><span className="rail-number">{String(progress.practiceAttempts.length).padStart(2, '0')}</span><span>已練題數</span></div><div className="rail-block"><span className="rail-number">{String(Object.values(progress.wordStreaks).filter(count => count >= 3).length).padStart(2, '0')}</span><span>已熟單字</span></div><div className="rail-block"><span className="rail-number">{String(Object.values(collocationProgress.done).filter(Boolean).length).padStart(2, '0')}</span><span>完成搭配課</span></div><div className="rail-message">每天一點點，<br />就會走得很遠。<span aria-hidden="true">✦</span></div></aside>
      {(page === 'reading' || page === 'listening') ? <Practice key={page} skill={page} questions={practiceQuestions} progress={progress} onProgressChange={updateProgress} /> : page === 'words' ? <Words words={words} progress={progress} onProgressChange={updateProgress} /> : page === 'collocations' ? <Collocations lessons={collocationLessons} progress={collocationProgress} onProgressChange={updateCollocationProgress} /> : <Productive key={page} mode={page} />}
    </div>
    <footer className="site-footer"><span>IELTS 練習室 · 原創示範題</span><span>練習在這裡，進步在每天。</span></footer>
    <Navigation page={page} mobile />
  </div>
}
