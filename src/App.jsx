import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import PlanMyDayButton from './components/PlanMyDayButton';
import DateNavigator from './components/DateNavigator';
import { todayStr, isOverdue, formatShort } from './utils/date';

const FILTERS = ['All', 'Pending', 'Done'];

export default function App() {
  const { tasks, newestId, addTask, toggleDone, deleteTask, sortTasks, setTaskDate } =
    useTasks();
  const [filter, setFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [dark, setDark] = useState(
    () => localStorage.getItem('task-planner-dark') === 'true'
  );

  function toggleDark() {
    setDark((d) => {
      localStorage.setItem('task-planner-dark', String(!d));
      return !d;
    });
  }

  // Only the selected day's tasks are shown; the status filter narrows within
  // that day.
  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const filtered = dayTasks.filter((t) => {
    if (filter === 'Pending') return !t.done;
    if (filter === 'Done') return t.done;
    return true;
  });

  const doneCount = dayTasks.filter((t) => t.done).length;

  // Late tasks: anything still pending whose day is already past. Used for the
  // footer reminder regardless of which day is being viewed.
  const overdue = tasks.filter(isOverdue);
  const oldestOverdue = overdue.reduce(
    (min, t) => (min && min < t.date ? min : t.date),
    null
  );

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
            <TaskForm onAdd={addTask} defaultDate={selectedDate} />
          </div>

          {/* Day picker */}
          <DateNavigator value={selectedDate} onChange={setSelectedDate} />

          {/* Toolbar: counter + filters + Plan My Day */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {doneCount} of {dayTasks.length} tasks done
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
            totalCount={dayTasks.length}
            filter={filter}
            newestId={newestId}
            onToggle={toggleDone}
            onDelete={deleteTask}
            onChangeDate={setTaskDate}
          />

          {/* Late-task reminder, pinned to the bottom of the page */}
          {overdue.length > 0 && (
            <button
              onClick={() => setSelectedDate(oldestOverdue)}
              className="w-full mt-6 p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-left transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                ⚠ {overdue.length} late {overdue.length === 1 ? 'task' : 'tasks'} not done
              </span>
              <span className="block text-xs text-red-600 dark:text-red-400 mt-0.5">
                Oldest from {formatShort(oldestOverdue)} — click to view and reschedule.
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
