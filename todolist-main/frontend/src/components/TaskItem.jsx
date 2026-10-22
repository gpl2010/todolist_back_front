import { CalendarIcon, CheckIcon, PencilIcon, TrashIcon } from './Icons.jsx';
import { formatDate, isOverdue } from '../utils.js';

export default function TaskItem({ task, today, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task, today);

  return (
    <li className={`task ${task.completed ? 'task--done' : ''} ${overdue ? 'task--overdue' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Desmarcar "${task.title}"` : `Concluir "${task.title}"`}
        className={`check ${task.completed ? 'check--on' : ''}`}
        onClick={() => onToggle(task)}
      >
        {task.completed && <CheckIcon width={16} height={16} />}
      </button>

      <div className="task__body">
        <span className="task__title">{task.title}</span>
        {(task.dueDate || overdue) && (
          <span className="task__meta">
            {task.dueDate && (
              <span className="task__date">
                <CalendarIcon width={14} height={14} />
                {formatDate(task.dueDate)}
              </span>
            )}
            {overdue && <span className="badge">Em atraso</span>}
          </span>
        )}
      </div>

      <div className="task__actions">
        <button type="button" className="icon-btn icon-btn--edit" aria-label={`Editar "${task.title}"`} title="Editar" onClick={() => onEdit(task)}>
          <PencilIcon width={18} height={18} />
        </button>
        <button type="button" className="icon-btn icon-btn--delete" aria-label={`Excluir "${task.title}"`} title="Excluir" onClick={() => onDelete(task)}>
          <TrashIcon width={18} height={18} />
        </button>
      </div>
    </li>
  );
}
