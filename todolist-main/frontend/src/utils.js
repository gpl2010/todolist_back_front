// Data de hoje no fuso local, no formato YYYY-MM-DD (mesmo formato do backend).
export function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Atrasada = ainda pendente e com data limite anterior a hoje.
export function isOverdue(task, today = todayISO()) {
  return !task.completed && Boolean(task.dueDate) && task.dueDate < today;
}

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Data mais próxima primeiro; sem data vão para o fim; empate: mais recentes antes.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
      return a.dueDate < b.dueDate ? -1 : 1;
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return b.id - a.id;
  });
}
