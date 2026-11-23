import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  PhoneOff,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';
import PrivacyOverlay from '../components/PrivacyOverlay';
import BiasPanel from '../components/BiasPanel';
import { useResearch } from '../contexts/ResearchContext';
import { ASSETS } from '../data/mockData';

interface TranscriptEntry {
  id: string;
  speaker: 'Participant' | 'Moderator';
  time: string;
  text: string;
  note?: string;
}

const SUGGESTED_FOLLOWUPS = [
  'What did you expect to see when you clicked the address field?',
  'Compared to your current tool, which part of this billing step felt clearest?',
  'Walk me through what made you pause before selecting the plan tier.',
];

const INITIAL_TRANSCRIPT: TranscriptEntry[] = [
  {
    id: 'tr1',
    speaker: 'Participant',
    time: '12:44',
    text: 'I am looking for where to enter my street address manually, because my studio suite does not show up in postal autocomplete.',
    note: 'Friction noted',
  },
  {
    id: 'tr2',
    speaker: 'Moderator',
    time: '12:45',
    text: 'Thank you for sharing that. What did you expect to happen after typing the first few letters?',
  },
  {
    id: 'tr3',
    speaker: 'Participant',
    time: '12:46',
    text: 'Usually there is a secondary link right beneath the dropdown that lets me expand street, city, and postcode fields.',
  },
];

const AgenticSession: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, addInsight } = useResearch();

  const project = projects.find((p) => p.id === projectId) || projects[0];

  const [showPrivacyShield, setShowPrivacyShield] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(765); // 12:45
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(INITIAL_TRANSCRIPT);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [moderatorInput, setModeratorInput] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const currentSuggestion = SUGGESTED_FOLLOWUPS[suggestionIdx % SUGGESTED_FOLLOWUPS.length];

  const handleApplyFollowup = () => {
    setTranscript((prev) => [
      ...prev,
      {
        id: `tr-${Date.now()}`,
        speaker: 'Moderator',
        time: formatTimer(elapsedSeconds),
        text: currentSuggestion,
        note: 'Neutral follow-up used',
      },
    ]);
    setSuggestionIdx((i) => i + 1);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moderatorInput.trim()) return;
    setTranscript((prev) => [
      ...prev,
      {
        id: `tr-${Date.now()}`,
        speaker: 'Moderator',
        time: formatTimer(elapsedSeconds),
        text: moderatorInput.trim(),
      },
    ]);
    setModeratorInput('');
  };

  const handleBookmarkInsight = () => {
    const latestParticipantLine = [...transcript]
      .reverse()
      .find((entry) => entry.speaker === 'Participant');
    addInsight({
      projectId: project.id,
      title: 'Manual address fallback missing beneath postal lookup',
      description:
        latestParticipantLine?.text ||
        'Participant requested an explicit manual address entry link beneath the autocomplete dropdown.',
      severity: 'Opportunity',
      clipTime: formatTimer(elapsedSeconds),
      participantName: 'Sarah Chen',
      mentions: 1,
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--sys-outline-variant)]">
        <div className="space-y-1">
          <Link
            to="/dashboard/sessions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--sys-on-surface-tertiary)] hover:text-[var(--sys-on-surface)] no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Sessions</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--sys-on-surface)]">{project.name}</h1>
          <p className="text-xs text-[var(--sys-on-surface-secondary)] font-mono tabular-nums">
            Live Session · Sarah Chen · Elapsed {formatTimer(elapsedSeconds)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPrivacyShield((v) => !v)}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap cursor-pointer"
          >
            {showPrivacyShield ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPrivacyShield ? 'Privacy Shield On' : 'Privacy Shield Off'}</span>
          </button>

          <button
            type="button"
            onClick={handleBookmarkInsight}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{savedNotice ? 'Saved to Insights' : 'Bookmark Moment'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/dashboard/projects/${project.id}/insights`)}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs font-semibold rounded-[var(--sys-radius-md)] text-white whitespace-nowrap cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--ref-danger)' }}
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End & Synthesise</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Video Feed + Interactive Live Transcript */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video rounded-[var(--sys-radius-lg)] overflow-hidden border border-[var(--sys-outline-variant)] bg-black">
            <img
              src={ASSETS.checkoutUi}
              alt="Participant shared screen showing checkout prototype"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90"
            />
            {showPrivacyShield && <PrivacyOverlay />}

            <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-4 bg-black/75 text-white px-4 py-2.5 rounded-[var(--sys-radius-md)] border border-white/15 text-xs tabular-nums">
              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold">{formatTimer(elapsedSeconds)}</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span>Sarah Chen (Shared Screen)</span>
              </div>
              <span className="font-mono opacity-80">1080p Encrypted Stream</span>
            </div>
          </div>

          {/* Live Transcript */}
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)] flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Live Transcript</h2>
              <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] tabular-nums">
                {transcript.length} entries
              </span>
            </div>

            <div className="p-5 space-y-4 max-h-[340px] overflow-y-auto">
              {transcript.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-xs font-bold shrink-0 ${
                      entry.speaker === 'Moderator'
                        ? 'bg-[var(--sys-primary-container)] text-[var(--sys-on-primary-container)]'
                        : 'bg-[var(--sys-surface-container)] text-[var(--sys-on-surface)]'
                    }`}
                  >
                    {entry.speaker === 'Moderator' ? 'M' : 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[var(--sys-on-surface-tertiary)] tabular-nums">
                      <span className="font-semibold text-[var(--sys-on-surface)]">
                        {entry.speaker}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{entry.time}</span>
                      {entry.note && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[var(--sys-primary)] font-medium">{entry.note}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed mt-1">
                      {entry.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddNote}
              className="p-4 border-t border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)] flex items-center gap-2.5"
            >
              <input
                type="text"
                value={moderatorInput}
                onChange={(e) => setModeratorInput(e.target.value)}
                placeholder="Log a moderator question or timestamped observation..."
                aria-label="Log moderator question"
                className="flex-1 h-10 px-3.5 text-sm sys-input"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </form>
          </section>
        </div>

        {/* Right: Co-Pilot Follow-up & Bias Audit Panel */}
        <div className="lg:col-span-4 space-y-6">
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[var(--sys-on-surface)] inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--sys-primary)]" />
                <span>Suggested Follow-up</span>
              </h3>
              <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] tabular-nums">
                {suggestionIdx + 1}/{SUGGESTED_FOLLOWUPS.length}
              </span>
            </div>

            <p className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] text-sm text-[var(--sys-on-surface)] leading-relaxed">
              “{currentSuggestion}”
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyFollowup}
                className="flex-1 min-h-[40px] px-4 py-2 text-xs sys-btn-primary cursor-pointer"
              >
                Ask & Log in Transcript
              </button>
              <button
                type="button"
                onClick={() => setSuggestionIdx((i) => i + 1)}
                className="min-h-[40px] px-3.5 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Next
              </button>
            </div>
          </section>

          <BiasPanel />
        </div>
      </div>
    </div>
  );
};

export default AgenticSession;
