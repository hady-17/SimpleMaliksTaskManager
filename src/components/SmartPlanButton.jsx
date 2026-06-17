export default function SmartPlanButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-lg border border-purple-300 dark:border-purple-500 text-purple-600 dark:text-purple-300 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      ✨ Smart Plan
    </button>
  );
}
