export type Skill = 'reading' | 'listening'
export type QuestionType = 'true-false-not-given' | 'reading-gap' | 'listening-choice' | 'listening-gap'
export type Level = 'B1' | 'B2'

export interface PracticeQuestion {
  id: string
  skill: Skill
  type: QuestionType
  level: Level
  prompt: string
  passage?: string
  transcript?: string
  answer: string
  options?: string[]
  explanation: string
}

export interface Word {
  id: string
  term: string
  meaning: string
  partOfSpeech: string
  example: string
  topic: string
}

export interface PracticeAttempt {
  questionId: string
  answer: string
  correct: boolean
  at: string
}

export interface PracticeSetResult {
  skill: Skill
  type: QuestionType
  level: Level
  score: number
  questionIds: string[]
  at: string
}

export interface Progress {
  practiceAttempts: PracticeAttempt[]
  practiceSets: PracticeSetResult[]
  wordStreaks: Record<string, number>
  cardRecall: Record<string, boolean>
  savedWords: string[]
}

export const emptyProgress = (): Progress => ({ practiceAttempts: [], practiceSets: [], wordStreaks: {}, cardRecall: {}, savedWords: [] })

export function getPracticeSet(questions: PracticeQuestion[], skill: Skill, type: QuestionType, level: Level): PracticeQuestion[] {
  return questions.filter(question => question.skill === skill && question.type === type && question.level === level).slice(0, 5)
}

export function recordWordAnswer(progress: Progress, wordId: string, correct: boolean): Progress {
  return {
    ...progress,
    cardRecall: { ...progress.cardRecall, [wordId]: correct },
    wordStreaks: {
      ...progress.wordStreaks,
      [wordId]: correct ? Math.min(3, (progress.wordStreaks[wordId] ?? 0) + 1) : 0,
    },
  }
}

export function markWordRecall(progress: Progress, wordId: string, remembered: boolean): Progress {
  return {
    ...progress,
    cardRecall: { ...progress.cardRecall, [wordId]: remembered },
    wordStreaks: remembered || progress.wordStreaks[wordId] === undefined ? progress.wordStreaks : { ...progress.wordStreaks, [wordId]: 0 },
  }
}

export function wordStatus(progress: Progress, wordId: string): 'new' | 'review' | 'learning' | 'mastered' {
  const streak = progress.wordStreaks[wordId]
  if (streak === undefined) return progress.cardRecall[wordId] === false ? 'review' : progress.cardRecall[wordId] === true ? 'learning' : 'new'
  if (streak === 0) return 'review'
  if (streak >= 3) return 'mastered'
  return 'learning'
}

export function getReviewWords(words: Word[], progress: Progress): Word[] {
  return words.filter(word => ['review', 'learning'].includes(wordStatus(progress, word.id)))
    .sort((a, b) => Number(wordStatus(progress, a.id) !== 'review') - Number(wordStatus(progress, b.id) !== 'review'))
}

export function completePracticeSet(progress: Progress, questions: PracticeQuestion[], correct: boolean[], at: string): Progress {
  if (!questions.length || questions.length !== correct.length) return progress
  return {
    ...progress,
    practiceSets: [...progress.practiceSets, {
      skill: questions[0].skill,
      type: questions[0].type,
      level: questions[0].level,
      score: correct.filter(Boolean).length,
      questionIds: questions.map(question => question.id),
      at,
    }],
  }
}

export function answerIsCorrect(question: PracticeQuestion, answer: string): boolean {
  return answer.trim().toLocaleLowerCase() === question.answer.trim().toLocaleLowerCase()
}
