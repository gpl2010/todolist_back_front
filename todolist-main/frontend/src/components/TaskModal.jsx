import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';

// mode: 'create' | 'edit'. Em 'edit', `task` vem preenchida.
export default function TaskModal({ mode, task, onClose, onSave }) {
  const isEdit = mode === 'edit';
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Dê um nome para a tarefa.');
      inputRef.current?.focus();
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ title: title.trim(), dueDate: dueDate || null });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onSubmit={handleSubmit} noValidate>
        <div className="modal__head">
          <h2 id="modal-title">{isEdit ? 'Edit Task' : 'Create Task'}</h2>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={onClose}>
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <label className="field">
          <span>Nome da tarefa</span>
          <input
            ref={inputRef}
            type="text"
            value={title}
            maxLength={255}
            placeholder="Ex.: Entregar o trabalho de Web"
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={Boolean(error)}
          />
        </label>

        <label className="field">
          <span>Data limite (opcional)</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </form>
    </div>
  );
}
