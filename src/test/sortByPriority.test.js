import { describe, it, expect } from 'vitest';
import { sortByPriority } from '../utils/sortByPriority';

describe('sortByPriority', () => {
  it('orders tasks High → Medium → Low', () => {
    const tasks = [
      { id: '1', priority: 'Low' },
      { id: '2', priority: 'High' },
      { id: '3', priority: 'Medium' },
    ];
    const sorted = sortByPriority(tasks);
    expect(sorted.map((t) => t.priority)).toEqual(['High', 'Medium', 'Low']);
  });

  it('does not mutate the original array', () => {
    const tasks = [
      { id: '1', priority: 'Low' },
      { id: '2', priority: 'High' },
    ];
    const sorted = sortByPriority(tasks);
    expect(tasks.map((t) => t.priority)).toEqual(['Low', 'High']);
    expect(sorted).not.toBe(tasks);
  });

  it('keeps the relative order of equal priorities (stable)', () => {
    const tasks = [
      { id: 'a', priority: 'High' },
      { id: 'b', priority: 'High' },
      { id: 'c', priority: 'Low' },
    ];
    const sorted = sortByPriority(tasks);
    expect(sorted.map((t) => t.id)).toEqual(['a', 'b', 'c']);
  });

  it('returns an empty array unchanged', () => {
    expect(sortByPriority([])).toEqual([]);
  });
});
