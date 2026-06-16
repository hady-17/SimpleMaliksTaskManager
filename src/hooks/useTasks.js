import { useState, useEffect } from 'react';

const STORAGE_KEY = 'task-planner-tasks';

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
      id: String(Date.now()),
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

  function sortTasks() {
    const ORDER = { High: 0, Medium: 1, Low: 2 };
    setTasks((prev) =>
      [...prev].sort((a, b) => ORDER[a.priority] - ORDER[b.priority])
    );
  }

  return { tasks, newestId, addTask, toggleDone, deleteTask, sortTasks };
}
