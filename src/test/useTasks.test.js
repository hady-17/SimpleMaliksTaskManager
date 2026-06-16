import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../hooks/useTasks';

beforeEach(() => {
  localStorage.clear();
});

describe('useTasks', () => {
  it('starts with no tasks when storage is empty', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });

  it('adds a task to the front of the list and marks it newest', () => {
    const { result } = renderHook(() => useTasks());

    act(() => result.current.addTask('First task', 'High', 'details'));

    expect(result.current.tasks).toHaveLength(1);
    const task = result.current.tasks[0];
    expect(task.title).toBe('First task');
    expect(task.priority).toBe('High');
    expect(task.description).toBe('details');
    expect(task.done).toBe(false);
    expect(result.current.newestId).toBe(task.id);
  });

  it('trims the title and description', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('  spaced  ', 'Low', '  note  '));
    expect(result.current.tasks[0].title).toBe('spaced');
    expect(result.current.tasks[0].description).toBe('note');
  });

  it('gives each task a unique id even when added in the same tick', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('A', 'Low');
      result.current.addTask('B', 'Low');
      result.current.addTask('C', 'Low');
    });
    const ids = result.current.tasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('toggles a task done and back', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Task', 'Medium'));
    const id = result.current.tasks[0].id;

    act(() => result.current.toggleDone(id));
    expect(result.current.tasks[0].done).toBe(true);

    act(() => result.current.toggleDone(id));
    expect(result.current.tasks[0].done).toBe(false);
  });

  it('deletes a task by id', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Keep', 'Low'));
    act(() => result.current.addTask('Remove', 'Low'));
    const removeId = result.current.tasks.find((t) => t.title === 'Remove').id;

    act(() => result.current.deleteTask(removeId));

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Keep');
  });

  it('persists tasks to localStorage', () => {
    const { result } = renderHook(() => useTasks());
    act(() => result.current.addTask('Persisted', 'High'));

    const stored = JSON.parse(localStorage.getItem('task-planner-tasks'));
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Persisted');
  });

  it('loads existing tasks from localStorage on init', () => {
    localStorage.setItem(
      'task-planner-tasks',
      JSON.stringify([
        { id: '1', title: 'Saved', priority: 'Low', done: false },
      ])
    );
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks[0].title).toBe('Saved');
  });

  describe('sortTasks (Plan My Day)', () => {
    it('sorts unfinished tasks by priority and floats them above done ones', () => {
      const { result } = renderHook(() => useTasks());
      act(() => result.current.addTask('Low pending', 'Low'));
      act(() => result.current.addTask('High pending', 'High'));
      act(() => result.current.addTask('Medium pending', 'Medium'));

      // Mark "Medium pending" done — it should drop below the pending ones.
      const mediumId = result.current.tasks.find(
        (t) => t.title === 'Medium pending'
      ).id;
      act(() => result.current.toggleDone(mediumId));

      act(() => result.current.sortTasks());

      const titles = result.current.tasks.map((t) => t.title);
      expect(titles).toEqual(['High pending', 'Low pending', 'Medium pending']);
      expect(result.current.tasks.at(-1).done).toBe(true);
    });

    it('keeps all done tasks at the bottom', () => {
      const { result } = renderHook(() => useTasks());
      act(() => result.current.addTask('Pending', 'Low'));
      act(() => result.current.addTask('Done one', 'High'));

      const doneId = result.current.tasks.find(
        (t) => t.title === 'Done one'
      ).id;
      act(() => result.current.toggleDone(doneId));
      act(() => result.current.sortTasks());

      expect(result.current.tasks[0].title).toBe('Pending');
      expect(result.current.tasks[1].title).toBe('Done one');
    });
  });
});
