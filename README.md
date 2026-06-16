# Task Planner

A lightweight task management app built with React, Vite, and Tailwind CSS.

## Live Demo

https://simple-maliks-task-manager.vercel.app

## Features

- **Add tasks** with a title and priority level (High / Medium / Low)
- **Optional description** — expandable via a "Description" toggle on the add form, shown beneath the task title
- **Voice input** — dictate a task with the 🎤 mic (browser Web Speech API)
  - **English & Arabic** — an EN / AR toggle switches the dictation language; Arabic uses the Lebanese locale (`ar-LB`)
  - **Auto-stop** — recording stops on its own once you finish talking, with a live transcript preview while you speak
- **Auto-translate to English** — Arabic task text (typed or dictated) is translated to English on submit via the free MyMemory API, with a graceful fallback to the original text if translation is unavailable
- **Toggle completion** — check off tasks as done
- **Delete tasks** with a confirmation dialog
- **Filter tasks** by All / Pending / Done, with **filter-aware empty states** (e.g. "everything is done!" instead of "add your first task" when all tasks are completed)
- **Plan My Day** — sorts the *unfinished* tasks by priority (High → Medium → Low) and floats them above completed ones
- **Dark mode** toggle with preference saved to localStorage
- **Persistent storage** — tasks survive page refreshes via localStorage
- **Maliks branding** — custom favicon

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Vitest + React Testing Library (unit tests)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Testing

Unit tests cover the core logic (priority sorting, task state, translation, and empty states).

```bash
npm test          # run the suite once
npm run test:watch # re-run on change
```

## Project Structure

```
src/
├── components/
│   ├── TaskForm.jsx          # Add-task input, priority, description toggle, voice input
│   ├── TaskList.jsx          # Renders the filtered list, picks the empty-state message
│   ├── TaskItem.jsx          # Individual task row with toggle/delete and description
│   ├── PlanMyDayButton.jsx   # Triggers the priority sort
│   ├── ConfirmDialog.jsx     # Delete confirmation modal
│   └── EmptyState.jsx        # Empty-state message (filter-aware)
├── hooks/
│   ├── useTasks.js           # Task state, unique IDs, localStorage persistence, sorting
│   └── useSpeechRecognition.js # Web Speech API wrapper (single-utterance dictation)
├── utils/
│   ├── sortByPriority.js     # Priority sort helper
│   └── translateToEnglish.js # Arabic → English translation (MyMemory API)
├── test/
│   ├── setup.js              # jest-dom matchers
│   ├── sortByPriority.test.js
│   ├── translateToEnglish.test.js
│   ├── useTasks.test.js
│   └── TaskList.test.jsx
└── App.jsx                   # Root layout, filter state, dark mode
```

## Notes & Limitations

- **Voice recognition** relies on the browser Web Speech API (Chrome / Edge / Safari). It is hidden in browsers that don't support it (e.g. Firefox). Arabic dialect accuracy is limited by the browser's engine.
- **Translation** uses the free MyMemory API (no key required) — good for short task text, rate-limited, and not LLM-grade. Both the recognizer and translator are isolated, so either can be upgraded later without touching the UI.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
