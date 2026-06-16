import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import PlanMyDayButton from './components/PlanMyDayButton';

const FILTERS = ['All', 'Pending', 'Done'];

export default function App() {
  const { tasks, newestId, addTask, toggleDone, deleteTask, sortTasks } = useTasks();
  const [filter, setFilter] = useState('All');
  const [dark, setDark] = useState(
    () => localStorage.getItem('task-planner-dark') === 'true'
  );

  function toggleDark() {
    setDark((d) => {
      localStorage.setItem('task-planner-dark', String(!d));
      return !d;
    });
  }

  const filtered = tasks.filter((t) => {
    if (filter === 'Pending') return !t.done;
    if (filter === 'Done') return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Task Planner
            </h1>
            <button
              onClick={toggleDark}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? '☀ Light' : '☾ Dark'}
            </button>
          </div>

          {/* Add task */}
          <div className="mb-4">
            <TaskForm onAdd={addTask} />
          </div>

          {/* Toolbar: counter + filters + Plan My Day */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {doneCount} of {tasks.length} tasks done
            </span>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      filter === f
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <PlanMyDayButton onClick={sortTasks} />
            </div>
          </div>

          {/* Task list */}
          <TaskList
            tasks={filtered}
            totalCount={tasks.length}
            filter={filter}
            newestId={newestId}
            onToggle={toggleDone}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </div>
  );
}
