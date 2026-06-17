import { addDays, formatDate, todayStr } from '../utils/date';

// Lets the user pick which day's tasks to view: step back/forward a day, jump
// to any date with the picker, or snap back to today.
export default function DateNavigator({ value, onChange }) {
  const isToday = value === todayStr();

  return (
    <div className="flex items-center justify-between gap-2 mb-4 p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <button
        onClick={() => onChange(addDays(value, -1))}
        aria-label="Previous day"
        className="px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        ‹
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {formatDate(value)}
        </span>
        <label className="relative cursor-pointer text-gray-400 hover:text-indigo-500 transition-colors" title="Jump to date">
          <span aria-hidden="true">📅</span>
          <input
            type="date"
            value={value}
            onChange={(e) => e.target.value && onChange(e.target.value)}
            aria-label="Jump to date"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
        {!isToday && (
          <button
            onClick={() => onChange(todayStr())}
            className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={() => onChange(addDays(value, 1))}
        aria-label="Next day"
        className="px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        ›
      </button>
    </div>
  );
}
