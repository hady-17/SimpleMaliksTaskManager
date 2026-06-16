import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

export default function TaskList({ tasks, newestId, onToggle, onDelete }) {
  if (tasks.length === 0) return <EmptyState />;

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
