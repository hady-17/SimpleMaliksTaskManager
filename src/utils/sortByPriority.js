const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

// Sorts an array of tasks by their priority in the order of High, Medium, and Low.
//it works by creating a new array of tasks and using the sort method to compare the priority values 
// of each task based on the PRIORITY_ORDER mapping.
export function sortByPriority(tasks) {
  return [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}
