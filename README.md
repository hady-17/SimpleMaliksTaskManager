# Task Planner

A lightweight task management app built with React, Vite, and Tailwind CSS.

## Live Demo

https://simple-maliks-task-manager.vercel.app

## Features

- **Add tasks** with a title and priority level (High / Medium / Low)
- **Toggle completion** — check off tasks as done
- **Delete tasks** with a confirmation dialog
- **Filter tasks** by All / Pending / Done
- **Plan My Day** — sorts tasks by priority (High → Medium → Low)
- **Dark mode** toggle with preference saved to localStorage
- **Persistent storage** — tasks survive page refreshes via localStorage

## Tech Stack

- React 19
- Vite
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── TaskForm.jsx        # Add-task input and priority selector
│   ├── TaskList.jsx        # Renders the filtered task list
│   ├── TaskItem.jsx        # Individual task row with toggle/delete
│   ├── PlanMyDayButton.jsx # Triggers priority sort
│   ├── ConfirmDialog.jsx   # Delete confirmation modal
│   └── EmptyState.jsx      # Shown when no tasks match the filter
├── hooks/
│   └── useTasks.js         # Task state, localStorage persistence
├── utils/
│   └── sortByPriority.js   # Priority sort helper
└── App.jsx                 # Root layout, filter state, dark mode
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
