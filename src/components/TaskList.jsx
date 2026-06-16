import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

// Picks an empty-state message that reflects why the list is empty: no tasks at
// all vs. none matching the current filter.
function emptyMessage(totalCount, filter) {
  if (totalCount === 0) return 'No tasks yet. Add your first task.';
  if (filter === 'Pending') return 'No pending tasks — everything is done! 🎉';
  if (filter === 'Done') return 'No completed tasks yet.';
  return 'No tasks to show.';
}

export default function TaskList({
  tasks,
  totalCount = 0,
  filter = 'All',
  newestId,
  onToggle,
  onDelete,
}) {
  if (tasks.length === 0) {
    return <EmptyState message={emptyMessage(totalCount, filter)} />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            isNew={task.id === newestId}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
