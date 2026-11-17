import data from './content/collocations.json'

export interface CollocationEntry {
  phrase: string
  weak?: string
  yue?: string
  frame?: string
  model?: string
  mistake?: string
}

export interface CollocationReview {
  phrase: string
  yue?: string
}

export interface CollocationTask {
  q: string
  answer?: string
  type?: string
  choices?: string[]
}

export interface CollocationLesson {
  id: string
  lesson: number
  date: string
  theme: string
  title: string
  review: CollocationReview[]
  collocations: CollocationEntry[]
  passage?: string
  tasks?: CollocationTask[]
  nextTheme?: string
  sourceFile?: string
}

export const collocationLessons = data.lessons as CollocationLesson[]
