// Date helpers. Tasks store their day as a "YYYY-MM-DD" string built from the
// LOCAL calendar (not toISOString, which would shift across the UTC boundary
// and land tasks on the wrong day for users behind/ahead of UTC).

export function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr() {
  return toDateStr(new Date());
}

// Shift a YYYY-MM-DD string by n days and return a new YYYY-MM-DD string.
export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return toDateStr(new Date(y, m - 1, d + n));
}

// Friendly label: Today / Yesterday / Tomorrow, otherwise "Sat, 21 Jun 2026".
export function formatDate(dateStr) {
  const today = todayStr();
  if (dateStr === today) return 'Today';
  if (dateStr === addDays(today, -1)) return 'Yesterday';
  if (dateStr === addDays(today, 1)) return 'Tomorrow';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Compact D/M/YYYY, e.g. "12/4/2026" — matches how the user writes dates.
export function formatShort(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d}/${m}/${y}`;
}

// A task is "late" when its day is before today and it is still not done.
export function isOverdue(task) {
  return !task.done && !!task.date && task.date < todayStr();
}
