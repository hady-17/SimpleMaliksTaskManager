# Task Planner

A lightweight task management app built with React, Vite, and Tailwind CSS.

## Live Demo

https://simple-maliks-task-manager.vercel.app

## Features

- **Add tasks** with a title and priority level (High / Medium / Low)
- **Schedule tasks by day** — pick a date when adding a task (defaults to the day you're currently viewing, e.g. keep it for today or set it for `12/4/2026`)
- **Browse days** — a date navigator steps backward/forward a day, jumps to any date via a picker, or snaps back to **Today**; each day shows only that day's tasks
- **Reschedule tasks** — click the 📅 date on any task to move it to another day
- **Late-task reminder** — a footer note counts tasks that are past their date and still not done, and clicking it jumps to the oldest overdue day so you can complete or reschedule them
- **Optional description** — expandable via a "Description" toggle on the add form, shown beneath the task title
- **Voice input** — dictate a task with the 🎤 mic (browser Web Speech API)
  - **English & Arabic** — an EN / AR toggle switches the dictation language; Arabic uses the Lebanese locale (`ar-LB`)
  - **Auto-stop** — recording stops on its own once you finish talking, with a live transcript preview while you speak
- **Auto-translate to English** — Arabic task text (typed or dictated) is translated to English on submit via the free MyMemory API, with a graceful fallback to the original text if translation is unavailable
- **Toggle completion** — check off tasks as done
- **Delete tasks** with a confirmation dialog
- **Filter tasks** by All / Pending / Done, with **filter-aware empty states** (e.g. "everything is done!" instead of "add your first task" when all tasks are completed)
- **Plan My Day** — sorts the *unfinished* tasks by priority (High → Medium → Low) and floats them above completed ones
- **✨ Smart Plan** — sends the selected day's tasks to OpenAI (via a serverless function, so the API key never reaches the browser) and returns a time-blocked daily plan plus a few practical tips for saving energy and working smart
  - **Save as Word** — downloads the generated plan and tips as a `.docx` file
- **Dark mode** toggle with preference saved to localStorage
- **Persistent storage** — tasks survive page refreshes via localStorage
- **Maliks branding** — custom favicon

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Vitest + React Testing Library (unit tests)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or newer (includes `npm`)

### Run it locally (cloned from GitHub)

```bash
# 1. Clone the repository
git clone https://github.com/hady-17/SimpleMaliksTaskManager

# 2. Enter the project folder
cd task-planner

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open the URL printed in the terminal — by default [http://localhost:5173](http://localhost:5173) — in your browser.

> If the repository was cloned into a different folder name, `cd` into that folder instead. Everything except the **Smart Plan** feature runs entirely in the browser with no backend or environment variables to configure.

### Smart Plan setup (optional)

The "✨ Smart Plan" button calls OpenAI (model: `gpt-5.4-mini`) through a small serverless function (`api/smart-plan.js`) so the API key is never exposed to the browser.

1. Copy `.env.local.example` to `.env.local` and add your key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys):
   ```bash
   cp .env.local.example .env.local
   ```
2. `npm run dev` (plain Vite) does **not** serve `/api` routes. To test Smart Plan locally, run it through the [Vercel CLI](https://vercel.com/docs/cli) instead, which serves the app and the serverless function together:
   ```bash
   npm install -g vercel
   vercel dev
   ```
3. For the deployed app, add `OPENAI_API_KEY` as an environment variable in the Vercel project settings (not prefixed with `VITE_` — it must stay server-only).

### Production build

```bash
npm run build    # outputs to dist/
npm run preview  # serve the built app locally
```

## Testing

Unit tests cover the core logic (priority sorting, task state, translation, empty states, and the Smart Plan request/export/modal flow).

```bash
npm test          # run the suite once
npm run test:watch # re-run on change
```

## Project Structure

```
api/
└── smart-plan.js              # Vercel serverless function — calls OpenAI server-side

src/
├── components/
│   ├── TaskForm.jsx          # Add-task input, date, priority, description toggle, voice input
│   ├── TaskList.jsx          # Renders the filtered list, picks the empty-state message
│   ├── TaskItem.jsx          # Individual task row with toggle/delete, description, reschedule
│   ├── DateNavigator.jsx     # Day picker: prev/next day, jump-to-date, "Today"
│   ├── PlanMyDayButton.jsx   # Triggers the priority sort
│   ├── SmartPlanButton.jsx   # Triggers the DeepSeek-generated plan
│   ├── SmartPlanModal.jsx    # Shows the generated plan + tips (loading/error states)
│   ├── ConfirmDialog.jsx     # Delete confirmation modal
│   └── EmptyState.jsx        # Empty-state message (filter-aware)
├── hooks/
│   ├── useTasks.js           # Task state, unique IDs, localStorage persistence, sorting, rescheduling
│   └── useSpeechRecognition.js # Web Speech API wrapper (single-utterance dictation)
├── utils/
│   ├── sortByPriority.js     # Priority sort helper
│   ├── date.js               # Local-safe date helpers (today, add days, formatting, overdue check)
│   ├── translateToEnglish.js # Arabic → English translation (MyMemory API)
│   ├── generateSmartPlan.js  # Calls /api/smart-plan and shapes the response for the UI
│   └── exportSmartPlanToDocx.js # Builds and downloads the plan as a .docx file
├── test/
│   ├── setup.js              # jest-dom matchers
│   ├── sortByPriority.test.js
│   ├── translateToEnglish.test.js
│   ├── useTasks.test.js
│   ├── generateSmartPlan.test.js
│   └── TaskList.test.jsx
└── App.jsx                   # Root layout, filter + selected-day state, dark mode, overdue footer
```

## Notes & Limitations

- **Voice recognition** relies on the browser Web Speech API (Chrome / Edge / Safari). It is hidden in browsers that don't support it (e.g. Firefox). Arabic dialect accuracy is limited by the browser's engine.
- **Translation** uses the free MyMemory API (no key required) — good for short task text, rate-limited, and not LLM-grade. Both the recognizer and translator are isolated, so either can be upgraded later without touching the UI.
- **Smart Plan** requires an OpenAI API key (see [Smart Plan setup](#smart-plan-setup-optional)) and network access; if the request fails (no key configured, rate limit, etc.) the modal shows the error instead of a generated plan.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |

