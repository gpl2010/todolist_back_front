import { useCallback, useEffect, useState } from 'react';
import * as api from './api.js';
import { useDebounce } from './hooks/useDebounce.js';
import { sortTasks, todayISO } from './utils.js';
import Header from './components/Header.jsx';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';
import { CheckIcon, ListIcon, PlusIcon, SearchIcon } from './components/Icons.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', task }

  const debouncedSearch = useDebounce(search, 400);
  const today = todayISO();

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  // Busca na API sempre que o termo (com debounce) muda ou quando pedimos reload.
  useEffect(() => {
    const controller = new AbortController();
    api
      .listTasks(debouncedSearch, controller.signal)
      .then((data) => {
        setTasks(sortTasks(data.tasks));
        setTotals({ total: data.total, completed: data.completed });
        setError('');
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedSearch, reloadKey]);

  async function handleToggle(task) {
    const completed = !task.completed;
    // Atualização otimista: a UI responde na hora e volta atrás se a API falhar.
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed } : t)));
    setTotals((prev) => ({ ...prev, completed: prev.completed + (completed ? 1 : -1) }));
    try {
      await api.updateTask(task.id, { completed });
    } catch (err) {
      setError(err.message);
      reload();
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    try {
      await api.deleteTask(task.id);
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(values) {
    if (modal.mode === 'edit') {
      await api.updateTask(modal.task.id, values);
    } else {
      await api.createTask(values);
    }
    setModal(null);
    reload();
  }

  const closeModal = useCallback(() => setModal(null), []);
  const pending = totals.total - totals.completed;
  const isSearching = debouncedSearch.trim() !== '';

  return (
    <div className="page">
      <main className="card">
        <Header />

        <section className="panel">
          <div className="toolbar">
            <label className="search">
              <SearchIcon width={20} height={20} />
              <input
                type="search"
                value={search}
                placeholder="Buscar tarefas..."
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar tarefas"
              />
            </label>
            <button type="button" className="btn btn--primary btn--add" onClick={() => setModal({ mode: 'create' })}>
              Adicionar <PlusIcon width={20} height={20} />
            </button>
          </div>

          <div className="list-head">
            <h2><ListIcon width={22} height={22} /> Minhas Tarefas</h2>
            <span className="counter" title="Concluídas / Total">
              {totals.completed} / {totals.total}
            </span>
          </div>

          {error && (
            <div className="alert" role="alert">
              <span>{error}</span>
              <button type="button" onClick={reload}>Tentar de novo</button>
            </div>
          )}

          {loading ? (
            <p className="state">Carregando tarefas…</p>
          ) : tasks.length === 0 ? (
            <div className="empty">
              <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">
                <rect x="12" y="8" width="40" height="48" rx="7" fill="#eaf2ff" stroke="#8db4ee" strokeWidth="3" />
                <path d="M22 24h20M22 34h20M22 44h11" stroke="#b7d0f7" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <p>{isSearching ? `Nenhuma tarefa encontrada para “${debouncedSearch.trim()}”.` : 'You have no pending tasks.'}</p>
            </div>
          ) : (
            <ul className="tasks">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  today={today}
                  onToggle={handleToggle}
                  onEdit={(t) => setModal({ mode: 'edit', task: t })}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </section>

        <footer className="footer">
          <span className="footer__badge"><CheckIcon width={18} height={18} /></span>
          <span className="footer__stats">
            Concluídas: <strong>{totals.completed}</strong>
            <i aria-hidden="true" />
            Pendentes: <strong>{pending}</strong>
          </span>
          <span className="footer__note">Você consegue!</span>
        </footer>
      </main>

      <button type="button" className="fab" aria-label="Criar nova tarefa" onClick={() => setModal({ mode: 'create' })}>
        <PlusIcon width={28} height={28} strokeWidth={2.6} />
      </button>

      {modal && <TaskModal mode={modal.mode} task={modal.task} onClose={closeModal} onSave={handleSave} />}
    </div>
  );
}
