import { useState, useEffect } from 'react';

const STORAGE_KEY = 'task-planner-tasks';

// Generates a collision-free task id. Date.now() alone repeats when several
// tasks are created in the same millisecond, so prefer crypto.randomUUID().
function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Loads tasks from localStorage. If there is an error or no tasks are found, it returns an empty array.
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Custom hook that manages tasks, including adding, toggling, deleting, and sorting tasks.
//usestate is used to manage the state of tasks and the newest task ID,
//  while useEffect is used to persist tasks to localStorage whenever they change.
export function useTasks() {
  const [tasks, setTasks] = useState(loadFromStorage);
  const [newestId, setNewestId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(title, priority, description = '') {
    const newTask = {
      id: createId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      done: false,
      createdAt: Date.now(),
    };
    setNewestId(newTask.id);
    setTasks((prev) => [newTask, ...prev]);
  }

  function toggleDone(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // "Plan My Day": order the unfinished tasks by priority and float them to the
  // top; completed tasks keep their relative order and sit below.
  function sortTasks() {
    const ORDER = { High: 0, Medium: 1, Low: 2 };
    setTasks((prev) => {
      const pending = prev
        .filter((t) => !t.done)
        .sort((a, b) => ORDER[a.priority] - ORDER[b.priority]);
      const done = prev.filter((t) => t.done);
      return [...pending, ...done];
    });
  }

  return { tasks, newestId, addTask, toggleDone, deleteTask, sortTasks };
}
