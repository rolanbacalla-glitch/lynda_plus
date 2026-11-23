import React from 'react';
import { Bookmark, BookmarkCheck, ArrowUpRight } from 'lucide-react';
import type { Participant } from '../data/mockData';

interface ParticipantCardProps {
  participant: Participant;
  onInspect: (participant: Participant) => void;
  onToggleShortlist: (id: string) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  onInspect,
  onToggleShortlist,
}) => {
  return (
    <article className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 flex flex-col justify-between gap-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={participant.avatar}
              alt={participant.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-[var(--sys-radius-md)] object-cover border border-[var(--sys-outline-variant)] shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[var(--sys-on-surface)] truncate">
                {participant.name}
              </h3>
              <p className="text-xs text-[var(--sys-on-surface-secondary)] truncate">
                {participant.role} · {participant.company}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleShortlist(participant.id)}
            aria-label={participant.shortlisted ? 'Remove from shortlist' : 'Shortlist participant'}
            className="w-9 h-9 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-low)] hover:text-[var(--sys-primary)] transition-colors cursor-pointer shrink-0"
          >
            {participant.shortlisted ? (
              <BookmarkCheck className="w-4 h-4 text-[var(--sys-primary)]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Clean unboxed metadata (zero pill sandwiches) */}
        <p className="text-xs text-[var(--sys-on-surface-tertiary)] tabular-nums">
          <span>{participant.location}</span>
          <span aria-hidden="true"> · </span>
          <span>{participant.experience}</span>
          <span aria-hidden="true"> · </span>
          <span
            className="font-semibold"
            style={{
              color:
                participant.status === 'Active'
                  ? 'var(--sys-success-fg)'
                  : 'var(--sys-on-surface-tertiary)',
            }}
          >
            {participant.status}
          </span>
        </p>

        <p className="text-xs text-[var(--sys-on-surface-secondary)] leading-relaxed line-clamp-2">
          {participant.recentNote}
        </p>

        <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
          {participant.tags.join(' · ')}
        </p>
      </div>

      <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex items-center justify-between gap-4 tabular-nums">
        <div className="text-xs">
          <span className="text-[var(--sys-on-surface-tertiary)]">Reliability </span>
          <span className="font-mono font-bold text-[var(--sys-on-surface)]">
            {participant.reliability}%
          </span>
          <span className="text-[var(--sys-on-surface-tertiary)]">
            {' '}
            ({participant.sessionsCompleted} sessions)
          </span>
        </div>

        <button
          type="button"
          onClick={() => onInspect(participant)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--sys-primary)] hover:underline whitespace-nowrap cursor-pointer"
        >
          <span>Inspect</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};

export default ParticipantCard;
