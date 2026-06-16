export default function EmptyState({ message = 'No tasks yet. Add your first task.' }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-lg">{message}</p>
    </div>
  );
}
