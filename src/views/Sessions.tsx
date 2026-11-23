import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, ShieldCheck, Video, X } from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import type { ResearchSession } from '../data/mockData';

const Sessions: React.FC = () => {
  const { sessions, projects, participants, addSession } = useResearch();
  const [filter, setFilter] = useState<'All' | ResearchSession['status']>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [projectId, setProjectId] = useState(projects[0]?.id || '1');
  const [participantName, setParticipantName] = useState(participants[0]?.name || 'Sarah Chen');
  const [scheduledAt, setScheduledAt] = useState('Thu, 11:30 AM GMT');
  const [duration, setDuration] = useState('45 min');
  const [privacyShield, setPrivacyShield] = useState(true);

  const filtered = useMemo(
    () => (filter === 'All' ? sessions : sessions.filter((s) => s.status === filter)),
    [sessions, filter]
  );

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === projectId) || projects[0];
    const participant = participants.find((p) => p.name === participantName);
    addSession({
      projectId: project.id,
      studyName: project.name,
      participantName,
      participantRole: participant?.role || 'Verified Panelist',
      scheduledAt: scheduledAt.trim() || 'Upcoming',
      duration,
      status: 'Scheduled',
      privacyShield,
      summary: `Moderated session scheduled for ${project.name}.`,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">Sessions</h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Live interview rooms, upcoming bookings, and synthesized session recordings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Session</span>
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Filter sessions"
        className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)]"
      >
        {(['All', 'Live', 'Scheduled', 'Completed'] as const).map((tab) => (
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
        {filtered.map((session) => (
          <div
            key={session.id}
            className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--sys-surface-low)]/50 transition-colors"
          >
            <div className="flex items-start gap-4 min-w-0">
              <img
                src={session.participantAvatar}
                alt={session.participantName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-[var(--sys-radius-md)] object-cover border border-[var(--sys-outline-variant)] shrink-0 mt-0.5"
              />
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        session.status === 'Live'
                          ? 'var(--sys-danger-fg)'
                          : session.status === 'Completed'
                          ? 'var(--sys-success-fg)'
                          : 'var(--sys-primary)',
                    }}
                  >
                    {session.status}
                  </span>
                  <span aria-hidden="true" className="text-[var(--sys-on-surface-quaternary)]">·</span>
                  <span className="font-mono text-[var(--sys-on-surface-tertiary)]">
                    {session.scheduledAt}
                  </span>
                  <span aria-hidden="true" className="text-[var(--sys-on-surface-quaternary)]">·</span>
                  <span className="font-mono text-[var(--sys-on-surface-tertiary)]">
                    {session.duration}
                  </span>
                  {session.privacyShield && (
                    <>
                      <span aria-hidden="true" className="text-[var(--sys-on-surface-quaternary)]">·</span>
                      <span className="inline-flex items-center gap-1 text-[var(--sys-on-surface-secondary)]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--sys-primary)]" />
                        Privacy Shield
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                  {session.studyName} — {session.participantName}
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-secondary)]">{session.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/dashboard/projects/${session.projectId}/record`}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 text-xs sys-btn-secondary whitespace-nowrap no-underline"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Booth</span>
              </Link>
              <Link
                to={
                  session.status === 'Completed'
                    ? `/dashboard/projects/${session.projectId}/insights`
                    : `/dashboard/projects/${session.projectId}/session`
                }
                className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 text-xs sys-btn-primary whitespace-nowrap no-underline"
              >
                <span>{session.status === 'Completed' ? 'View Synthesis' : 'Open Live Room'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-14 text-center text-sm text-[var(--sys-on-surface-secondary)]">
            No sessions in this status yet.
          </div>
        )}
      </div>

      {/* Schedule Session Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="schedule-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleSchedule}
            className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="schedule-modal-title" className="text-lg font-bold text-[var(--sys-on-surface)]">
                Schedule Interview Session
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
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                  Study
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full h-10 px-3 text-sm sys-input"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                  Participant
                </label>
                <select
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full h-10 px-3 text-sm sys-input"
                >
                  {participants.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full h-10 px-3 text-sm sys-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-10 px-3 text-sm sys-input"
                  >
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center justify-between pt-2 text-xs font-medium text-[var(--sys-on-surface)] cursor-pointer">
                <span>Enable Privacy Shield redaction</span>
                <input
                  type="checkbox"
                  checked={privacyShield}
                  onChange={(e) => setPrivacyShield(e.target.checked)}
                  className="w-4 h-4 accent-[var(--sys-primary)]"
                />
              </label>
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
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sessions;
