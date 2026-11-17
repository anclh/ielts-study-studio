# IELTS Practice and Words Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive IELTS Practice and Words app with original sample content and device local progress.

**Architecture:** A Vite React TypeScript client uses typed content modules and pure session and mastery functions. React screens drive practice and vocabulary flows; a versioned localStorage adapter persists progress. The browser speech API provides sample listening and word pronunciation with a transcript fallback.

**Tech Stack:** React, TypeScript, Vite, CSS, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-17-ielts-practice-words-design.md`

## Global Constraints

- Traditional Chinese interface with original English learning content.
- Five questions per Practice set; roughly ten words per vocabulary round.
- Three consecutive correct vocabulary quiz answers mark a word mastered; an error resets its streak.
- No server, account, production analytics, official score estimate, or licensed question bank.
- Persist progress locally and keep the app usable when storage or speech is unavailable.
- Keyboard usable controls, visible focus, and readable contrast.

## Review Focus

- Invalid stored JSON loads an empty progress state without crashing: Task 1 test.
- A wrong word answer after two correct answers resets the streak to zero: Task 1 test.
- A learner cannot advance an unanswered practice question: Task 2 interaction check.
- Speech unavailable exposes the listening transcript and keeps the question answerable: Task 2 interaction check.
- Mobile width keeps navigation, cards, and answer controls usable without horizontal overflow: Task 3 viewport check.

---

## File Structure

- `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`: app and test setup.
- `src/content/practice.ts`, `src/content/words.ts`: original typed sample data.
- `src/model.ts`: content and progress types plus pure session and mastery functions.
- `src/storage.ts`: versioned progress load and save.
- `src/model.test.ts`, `src/storage.test.ts`: consequential state and storage checks.
- `src/App.tsx`: navigation and screen composition.
- `src/Practice.tsx`, `src/Words.tsx`: learner flows.
- `src/styles.css`: responsive visual system and focus states.
- `README.md`: local run instructions and sample content limits.

### Task 1: App foundation, content, and progress model

**Files:** Create `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/content/practice.ts`, `src/content/words.ts`, `src/model.ts`, `src/storage.ts`, `src/model.test.ts`, `src/storage.test.ts`.

**Interfaces:** `PracticeQuestion`, `Word`, `Progress`; `getPracticeSet(questions, skill, type, level): PracticeQuestion[]`; `recordWordAnswer(progress, wordId, correct): Progress`; `loadProgress(storage): Progress`; `saveProgress(storage, progress): void`.

- [ ] Write tests for five selected questions, three consecutive correct word answers, an incorrect answer resetting a two-answer streak, and malformed stored JSON returning empty progress.
- [ ] Run `npm test -- --run`; expect tests to fail before implementation.
- [ ] Add Vite setup, typed original questions and words, selection and mastery functions, and versioned storage.
- [ ] Run `npm test -- --run` and `npm run build`; expect both to pass.

### Task 2: Practice flow

**Files:** Create `src/Practice.tsx`; modify `src/App.tsx` and `src/model.ts` as needed.

**Interfaces:** `Practice({ questions, progress, onProgressChange })`; consumes Task 1 types and `getPracticeSet`.

- [ ] Build skill, type, and level selection with five-question availability clearly shown.
- [ ] Build question input, progress, submit lock until answered, answer feedback, Traditional Chinese explanation, and results review.
- [ ] Add browser speech playback for listening and a visible transcript fallback when speech is unavailable or the learner requests it.
- [ ] Verify one reading and one listening set manually, including no advance on an unanswered question and transcript fallback.

### Task 3: Words flow and responsive shell

**Files:** Create `src/Words.tsx`, `src/styles.css`, `README.md`; complete `src/App.tsx`.

**Interfaces:** `Words({ words, progress, onProgressChange })`; consumes Task 1 types and `recordWordAnswer`.

- [ ] Build topic list with counts, ten-word flashcard rounds, reveal/remember actions, meaning quiz, saved words, and needs-review round.
- [ ] Connect quiz outcomes to mastery state and persist through App; add word pronunciation when speech is available.
- [ ] Style responsive Practice and Words navigation, cards, question controls, result views, focus states, and small-screen layout.
- [ ] Verify study, quiz, save, reload persistence, keyboard focus, and a mobile viewport without horizontal overflow.
- [ ] Run `npm test -- --run` and `npm run build`; document `npm install` and `npm run dev` in README.

## Self-review

The three tasks cover the spec's app structure, Practice, Words, persistence, accessibility, and local run instructions. The sample content and exact visual style remain builder choices as the spec permits. This workspace has no Git repository, so commit steps are omitted.
