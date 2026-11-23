import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Circle,
  Play,
  Plus,
  Search,
  Video,
} from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import type { StudyStatus } from '../data/mockData';

const ProjectList: React.FC = () => {
  const { projects, participants, sessions, tasks, toggleTask } = useResearch();
  const [statusFilter, setStatusFilter] = useState<'All' | StudyStatus>('All');
  const [query, setQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.method.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [projects, statusFilter, query]);

  const activeCount = projects.filter((p) => p.status === 'Live').length;
  const openTasks = tasks.filter((t) => !t.completed);
  const avgNeutrality = Math.round(
    projects.reduce((acc, item) => acc + item.neutralityScore, 0) / Math.max(projects.length, 1)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            Research Overview
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Monitor active studies, script neutrality, and participant momentum across your workspace.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/dashboard/preview"
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap no-underline"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Preview Study</span>
          </Link>
          <Link
            to="/dashboard/create"
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap no-underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Study</span>
          </Link>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">Active Studies</p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)] mt-1.5">
            {activeCount}
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            {projects.length} total in workspace
          </p>
        </div>

        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Verified Panellists
          </p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)] mt-1.5">
            {participants.length}
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            94% average reliability
          </p>
        </div>

        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Script Neutrality
          </p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-primary)] mt-1.5">
            {avgNeutrality}%
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            Audited across all guides
          </p>
        </div>

        <div className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest">
          <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Open Action Items
          </p>
          <p className="text-2xl font-bold font-mono text-[var(--sys-on-surface)] mt-1.5">
            {openTasks.length}
          </p>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
            Linked to verified insights
          </p>
        </div>
      </div>

      {/* Studies Directory Table */}
      <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
        <div className="p-5 border-b border-[var(--sys-outline-variant)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Studies</h2>
            <div
              role="tablist"
              aria-label="Filter studies by status"
              className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-sm)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]"
            >
              {(['All', 'Live', 'Completed', 'Draft'] as const).map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-xs font-medium rounded-[var(--sys-radius-xs)] transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs font-semibold'
                        : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[var(--sys-on-surface-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter studies..."
              aria-label="Filter studies"
              className="w-full h-9 pl-9 pr-3 text-xs sys-input"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px] tabular-nums">
            <thead>
              <tr className="border-b border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)]/60 text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                <th className="py-3 px-5">Study</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Participants</th>
                <th className="py-3 px-4 text-right">Neutrality</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sys-outline-variant)] text-sm">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-[var(--sys-surface-low)]/50 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <Link
                      to={`/dashboard/projects/${project.id}/insights`}
                      className="font-semibold text-[var(--sys-on-surface)] hover:text-[var(--sys-primary)] no-underline block"
                    >
                      {project.name}
                    </Link>
                    <span className="text-xs text-[var(--sys-on-surface-tertiary)]">
                      Updated {project.lastUpdated}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[var(--sys-on-surface-secondary)]">
                    {project.method}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold">
                    <span
                      style={{
                        color:
                          project.status === 'Live'
                            ? 'var(--sys-success-fg)'
                            : project.status === 'Completed'
                            ? 'var(--sys-primary)'
                            : 'var(--sys-on-surface-tertiary)',
                      }}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-[var(--sys-on-surface)]">
                    {project.participants} / {project.targetParticipants}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-[var(--sys-on-surface)]">
                    {project.neutralityScore}%
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/dashboard/projects/${project.id}/session`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--sys-radius-sm)] sys-btn-secondary no-underline whitespace-nowrap"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Session</span>
                      </Link>
                      <Link
                        to={`/dashboard/projects/${project.id}/insights`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--sys-radius-sm)] sys-btn-primary no-underline whitespace-nowrap"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Insights</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-[var(--sys-on-surface-secondary)]">
                    No studies match your current filter.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter('All');
                        setQuery('');
                      }}
                      className="text-[var(--sys-primary)] font-semibold underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lower Two-Column Activity Split: Recent Sessions & Open Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Sessions */}
        <section className="lg:col-span-7 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
          <div className="p-5 border-b border-[var(--sys-outline-variant)] flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Recent Sessions</h2>
            <Link
              to="/dashboard/sessions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--sys-primary)] hover:underline no-underline"
            >
              <span>All sessions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[var(--sys-outline-variant)]">
            {sessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--sys-surface-low)]/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={session.participantAvatar}
                    alt={session.participantName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-[var(--sys-radius-sm)] object-cover border border-[var(--sys-outline-variant)] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)] truncate">
                      {session.studyName}
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] truncate">
                      {session.participantName} · {session.scheduledAt} · {session.duration}
                    </p>
                  </div>
                </div>

                <Link
                  to={
                    session.status === 'Completed'
                      ? `/dashboard/projects/${session.projectId}/insights`
                      : `/dashboard/projects/${session.projectId}/session`
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold sys-btn-secondary whitespace-nowrap shrink-0 no-underline self-start sm:self-center"
                >
                  <span>{session.status === 'Completed' ? 'Review Synthesis' : 'Join Room'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Action Items */}
        <section className="lg:col-span-5 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
          <div className="p-5 border-b border-[var(--sys-outline-variant)] flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Action Items</h2>
            <Link
              to="/dashboard/tasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--sys-primary)] hover:underline no-underline"
            >
              <span>Manage tasks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[var(--sys-outline-variant)]">
            {tasks.slice(0, 4).map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className="w-full text-left p-4 flex items-start gap-3 hover:bg-[var(--sys-surface-low)]/60 transition-colors cursor-pointer"
              >
                {task.completed ? (
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: 'var(--sys-success-fg)' }}
                  />
                ) : (
                  <Circle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--sys-on-surface-tertiary)]" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium leading-snug ${
                      task.completed
                        ? 'line-through text-[var(--sys-on-surface-tertiary)]'
                        : 'text-[var(--sys-on-surface)]'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-1">
                    {task.assignee} · Due {task.dueDate} · {task.priority}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectList;
