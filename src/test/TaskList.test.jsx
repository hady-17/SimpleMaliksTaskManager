import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskList from '../components/TaskList';

const noop = () => {};

describe('TaskList empty states', () => {
  it('prompts to add a first task when there are no tasks at all', () => {
    render(<TaskList tasks={[]} totalCount={0} filter="All" onToggle={noop} onDelete={noop} />);
    expect(screen.getByText(/add your first task/i)).toBeInTheDocument();
  });

  it('shows an "everything is done" message under the Pending filter', () => {
    render(<TaskList tasks={[]} totalCount={3} filter="Pending" onToggle={noop} onDelete={noop} />);
    expect(screen.getByText(/everything is done/i)).toBeInTheDocument();
    expect(screen.queryByText(/add your first task/i)).not.toBeInTheDocument();
  });

  it('shows a "no completed tasks" message under the Done filter', () => {
    render(<TaskList tasks={[]} totalCount={3} filter="Done" onToggle={noop} onDelete={noop} />);
    expect(screen.getByText(/no completed tasks/i)).toBeInTheDocument();
  });

  it('renders the tasks when the list is non-empty', () => {
    const tasks = [
      { id: '1', title: 'Write tests', priority: 'High', done: false, date: '2026-06-17' },
    ];
    render(
      <TaskList tasks={tasks} totalCount={1} filter="All" onToggle={noop} onDelete={noop} />
    );
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });
});
