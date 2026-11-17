# IELTS Practice and Words App — Design

## Intent

Build a new, runnable web app inspired by the reference site's Practice and Words pages. The first version should let an IELTS learner independently practise short listening and reading sets, study vocabulary by topic, and keep their progress on the current device. This is a focused first version, selected by the user over a larger account based platform.

## Reference and limits

The public app files for the supplied reference indicate that Practice offers subject and question type selection, level filtering, five-question sets, answer feedback, and results. Words offers topic chapters, roughly ten-word rounds, flashcards, quizzes, a saved word list, and mastery tracked through three correct responses without an intervening error. The live browser preview failed, so exact visual layout and interactions could not be verified. Build an original interface and original sample content; do not reuse the reference site's code, branding, question bank, or media.

## Goals

- Provide responsive Practice and Words screens in Traditional Chinese, with English learning content.
- Offer reading True/False/Not Given and gap-fill questions, and listening multiple-choice and gap-fill questions.
- Let learners pick a skill, question type, and level, then complete a five-question set with feedback, explanations, and a results summary.
- Provide topic based vocabulary rounds of about ten words, flashcards, pronunciation, and a short meaning quiz.
- Show vocabulary status as new, learning, needs review, or mastered; require three consecutive correct quiz answers to master a word.
- Save completed answers, saved words, and vocabulary progress in browser storage so reloading preserves them.
- Include enough original sample questions and words to exercise every flow without a server.

## Non-goals

- Accounts, cross device sync, payments, teacher tools, and production analytics.
- An official IELTS score estimate or a full length mock exam.
- A large or licensed exam question bank.
- Claiming browser text to speech is authentic IELTS listening audio.

## Constraints and choices

- The workspace is empty and has no existing framework. Use React, TypeScript, and Vite for a small client side app.
- Keep content in typed local data modules so it can later be replaced by an owned question bank.
- Use the browser SpeechSynthesis API for original listening prompts and word pronunciation, with a visible transcript fallback if speech is unavailable. Label this as sample listening practice.
- Use localStorage with a versioned state key. Handle unavailable or malformed storage without crashing.
- Make all controls keyboard usable, give audio controls text labels, and provide visible focus and readable contrast.

## Approaches considered

1. **Focused local app — selected.** Original sample content, two core screens, device local progress. Fast to run and review; content and progress are limited to the device.
2. **Full learning platform.** Accounts, sync, a substantial question bank, and administration. Better for operating a real service, but requires backend, content ownership, and account decisions beyond this first version.

## Screens and behavior

### Navigation

Top or bottom navigation exposes Practice and Words. The current section remains clear on desktop and mobile. A compact home summary can show recent practice and vocabulary progress, but must not obstruct the two core flows.

### Practice

The entry screen shows Listening and Reading, available question types, level choices, and a start button. A set contains five questions of the chosen type and level where sample content permits; the UI makes limited sample coverage clear. During a set, the learner sees a progress indicator, question prompt, answer controls, and a submit action. After each submission, show the correct answer, an explanation in Traditional Chinese, and next action. At the end, show score, question review, and a way to start another set. Reading passages remain visible with their questions. Listening offers speech playback and transcript fallback.

### Words

The entry screen lists topics with counts and mastery progress. A topic opens a roughly ten-word round. Flashcards show the English word first and reveal meaning, part of speech, and an example; learners can mark whether they remembered it. A quiz asks the learner to choose the correct Chinese meaning, then shows feedback. Incorrect answers reset that word's consecutive correct count and put it in needs review. A review control prioritizes needs review and learning words. Saved words are accessible in their own list. Pronunciation uses browser speech where available.

### Persistence

Store answer attempts, set summaries, saved word IDs, and word streaks locally. On app load, validate the stored shape and fall back to an empty state if it is invalid. No login is required.

## Success check

A learner can complete one reading and one listening five-question set, see feedback and results, study a topic's cards, take its quiz, save a word, refresh, and find their progress intact. The app builds and runs locally and works at mobile and desktop widths.

## Left to the builder

Choose the original sample topics and question wording, precise visual style, component boundaries, and minimal verification strategy. Keep the app clearly inspired by the reference flows without copying its assets or presentation.
