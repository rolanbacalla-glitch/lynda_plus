import React, { useMemo, useState } from 'react';
import { CheckCircle2, Circle, Plus, X } from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import type { ResearchTask } from '../data/mockData';

const Tasks: React.FC = () => {
  const { tasks, projects, teamMembers, toggleTask, addTask } = useResearch();
  const [filter, setFilter] = useState<'All' | 'Open' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [studyName, setStudyName] = useState(projects[0]?.name || 'Mobile Onboarding Flow');
  const [assignee, setAssignee] = useState(teamMembers[0]?.name || 'Elena Rodriguez');
  const [priority, setPriority] = useState<ResearchTask['priority']>('High');
  const [dueDate, setDueDate] = useState('Apr 02');

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === 'Open') return !t.completed;
      if (filter === 'Completed') return t.completed;
      return true;
    });
  }, [tasks, filter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      studyName,
      assignee,
      priority,
      dueDate: dueDate.trim() || 'Next Week',
    });
    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            Research Tasks
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Track fieldwork prep, compliance exports, and engineering follow-ups promoted from insights.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Filter tasks"
        className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)]"
      >
        {(['All', 'Open', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={filter === tab}
            onClick={() => setFilter(tab)}
            className={`min-h-[36px] px-4 py-1 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors cursor-pointer ${
              filter === tab
                ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest divide-y divide-[var(--sys-outline-variant)]">
        {filtered.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggleTask(task.id)}
            className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-[var(--sys-surface-low)]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              {task.completed ? (
                <CheckCircle2
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: 'var(--sys-success-fg)' }}
                />
              ) : (
                <Circle className="w-5 h-5 shrink-0 mt-0.5 text-[var(--sys-on-surface-tertiary)]" />
              )}
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    task.completed
                      ? 'line-through text-[var(--sys-on-surface-tertiary)]'
                      : 'text-[var(--sys-on-surface)]'
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                  {task.studyName} · Assigned to {task.assignee}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 tabular-nums">
              <p
                className="text-xs font-semibold"
                style={{
                  color:
                    task.priority === 'High'
                      ? 'var(--sys-danger-fg)'
                      : task.priority === 'Medium'
                      ? 'var(--sys-warning-fg)'
                      : 'var(--sys-on-surface-tertiary)',
                }}
              >
                {task.priority}
              </p>
              <p className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] mt-0.5">
                {task.dueDate}
              </p>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="py-14 text-center text-sm text-[var(--sys-on-surface-secondary)]">
            No tasks in this view.
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-task-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleCreate}
            className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="add-task-title" className="text-lg font-bold text-[var(--sys-on-surface)]">
                Add Research Task
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-container)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task description..."
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
              <select
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                aria-label="Linked study"
                className="w-full h-10 px-3 text-sm sys-input"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-2.5">
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  aria-label="Assignee"
                  className="h-10 px-2.5 text-xs sys-input"
                >
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ResearchTask['priority'])}
                  aria-label="Priority"
                  className="h-10 px-2.5 text-xs sys-input"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="Due date"
                  className="h-10 px-2.5 text-xs sys-input"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-xs sys-btn-primary cursor-pointer">
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Tasks;
