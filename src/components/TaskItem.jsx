import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { formatShort, isOverdue } from '../utils/date';

const PRIORITY_STYLES = {
  High: 'border-red-400 bg-red-50',
  Medium: 'border-yellow-400 bg-yellow-50',
  Low: 'border-green-400 bg-green-50',
};

const BADGE_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

export default function TaskItem({ task, isNew, onToggle, onDelete, onChangeDate }) {
  const [confirming, setConfirming] = useState(false);
  const overdue = isOverdue(task);

  return (
    <>
      <div
        className={`flex items-center gap-3 p-3 rounded-xl border-l-4 shadow-sm transition-all duration-200 ${isNew ? 'animate-fadeIn' : ''} ${PRIORITY_STYLES[task.priority]} ${task.done ? 'opacity-60' : ''}`}
      >
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
          className="w-4 h-4 accent-indigo-500 shrink-0 cursor-pointer"
          aria-label={`Mark "${task.title}" as ${task.done ? 'pending' : 'done'}`}
        />
        <div className="flex-1 min-w-0">
          <span
            className={`block text-sm text-gray-800 ${task.done ? 'line-through text-gray-400' : ''}`}
          >
            {task.title}
          </span>
          {task.description && (
            <span className={`block text-xs mt-0.5 ${task.done ? 'text-gray-300' : 'text-gray-500'}`}>
              {task.description}
            </span>
          )}
          <label
            className={`relative inline-flex items-center gap-1 mt-1 text-xs cursor-pointer ${
              overdue ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}
            title="Reschedule this task"
          >
            <span aria-hidden="true">📅</span>
            <span>{formatShort(task.date)}{overdue ? ' · overdue' : ''}</span>
            {/* Transparent native picker laid over the label so the whole
                chip is clickable to reschedule the task. */}
            <input
              type="date"
              value={task.date}
              onChange={(e) => e.target.value && onChangeDate(task.id, e.target.value)}
              aria-label={`Reschedule "${task.title}"`}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${BADGE_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>
        <button
          onClick={() => setConfirming(true)}
          className="shrink-0 text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
          aria-label={`Delete "${task.title}"`}
        >
          ×
        </button>
      </div>

      {confirming && (
        <ConfirmDialog
          message={`"${task.title}" will be permanently removed.`}
          onConfirm={() => onDelete(task.id)}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
