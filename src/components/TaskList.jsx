import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

// Picks an empty-state message that reflects why the list is empty: a brand-new
// app with no tasks at all, an empty day, or none matching the current filter.
function emptyMessage(totalCount, filter, hasAnyTasks) {
  if (filter === 'Pending') return 'No pending tasks — everything is done! 🎉';
  if (filter === 'Done') return 'No completed tasks yet.';
  if (totalCount === 0) {
    return hasAnyTasks
      ? 'Nothing scheduled for this day.'
      : 'No tasks yet. Add your first task.';
  }
  return 'No tasks to show.';
}

export default function TaskList({
  tasks,
  totalCount = 0,
  filter = 'All',
  hasAnyTasks = false,
  newestId,
  onToggle,
  onDelete,
  onChangeDate,
}) {
  if (tasks.length === 0) {
    return <EmptyState message={emptyMessage(totalCount, filter, hasAnyTasks)} />;
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
            onChangeDate={onChangeDate}
          />
        </li>
      ))}
    </ul>
  );
}
