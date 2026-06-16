export default function PlanMyDayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg border border-indigo-300 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors"
    >
      Plan My Day
    </button>
  );
}
