const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Algo deu errado. Tente novamente.');
  return data;
}

// O MySQL devolve `completed` como 0/1 e `due_date` como "YYYY-MM-DD".
function normalize(row) {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    dueDate: row.due_date ? String(row.due_date).slice(0, 10) : null,
    createdAt: row.created_at,
  };
}

export async function listTasks(search = '', signal) {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  const data = await request(`/api/tasks${query}`, { signal });
  return {
    tasks: data.tasks.map(normalize),
    total: data.total,
    completed: data.completed,
  };
}

export async function createTask({ title, dueDate }) {
  return normalize(
    await request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, dueDate: dueDate || null }),
    })
  );
}

export async function updateTask(id, changes) {
  return normalize(
    await request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    })
  );
}

export async function deleteTask(id) {
  await request(`/api/tasks/${id}`, { method: 'DELETE' });
}
