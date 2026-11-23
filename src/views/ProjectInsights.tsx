import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckSquare,
  Crosshair,
  Pause,
  Play,
  Plus,
  Video,
} from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import { ASSETS, mockThemes, type InsightItem } from '../data/mockData';

const VIDEO_CHAPTERS = [
  {
    id: 'ch1',
    time: '04:12',
    label: 'Address lookup friction',
    speaker: 'Sarah Chen',
    quote:
      '“I typed my street name into the lookup field and thought the form froze when manual entry disappeared.”',
  },
  {
    id: 'ch2',
    time: '09:40',
    label: 'Order summary clarity',
    speaker: 'Marcus Miller',
    quote:
      '“Seeing the line-item tax next to the Confirm button gave me immediate confidence on the final charge.”',
  },
  {
    id: 'ch3',
    time: '14:05',
    label: 'Seat role hesitation',
    speaker: 'Elena Rodriguez',
    quote:
      '“I wanted to invite our PM as a viewer, but I had to hover over a tiny icon to confirm they couldn’t edit scripts.”',
  },
];

const CLICK_HOTSPOTS = [
  { id: 'h1', x: 61, y: 60, pct: '54%', label: 'Confirm & Pay CTA' },
  { id: 'h2', x: 39, y: 52, pct: '29%', label: 'Address Lookup Input' },
  { id: 'h3', x: 61, y: 42, pct: '17%', label: 'Order Summary Total' },
];

const ProjectInsights: React.FC = () => {
  const { projectId } = useParams();
  const { projects, insights, addInsight, promoteInsightToTask } = useResearch();

  const project = projects.find((p) => p.id === projectId) || projects[0];
  const [severityFilter, setSeverityFilter] = useState<'All' | InsightItem['severity']>('All');
  const [activeChapterId, setActiveChapterId] = useState(VIDEO_CHAPTERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSeverity, setNewSeverity] = useState<InsightItem['severity']>('Opportunity');

  const studyInsights = useMemo(() => {
    const matched = insights.filter((i) => i.projectId === project.id);
    const source = matched.length > 0 ? matched : insights;
    return severityFilter === 'All'
      ? source
      : source.filter((item) => item.severity === severityFilter);
  }, [insights, project.id, severityFilter]);

  const activeChapter =
    VIDEO_CHAPTERS.find((c) => c.id === activeChapterId) || VIDEO_CHAPTERS[0];

  const handleLogInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;
    addInsight({
      projectId: project.id,
      title: newTitle.trim(),
      description: newDescription.trim(),
      severity: newSeverity,
      clipTime: '06:18',
      participantName: 'Researcher Note',
      mentions: 1,
    });
    setNewTitle('');
    setNewDescription('');
    setShowNewForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--sys-on-surface-tertiary)] hover:text-[var(--sys-on-surface)] no-underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            {project.name}
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] tabular-nums">
            {project.method} · {project.participants} participants · {project.neutralityScore}% script neutrality
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to={`/dashboard/projects/${project.id}/session`}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap no-underline"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Open Live Room</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowNewForm((prev) => !prev)}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Insight</span>
          </button>
        </div>
      </div>

      {/* Inline Add Insight Form */}
      {showNewForm && (
        <form
          onSubmit={handleLogInsight}
          className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--sys-on-surface)]">Add Verified Insight</h2>
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value as InsightItem['severity'])}
              aria-label="Insight severity"
              className="h-9 px-3 text-xs sys-input"
            >
              <option value="Critical">Critical</option>
              <option value="Opportunity">Opportunity</option>
              <option value="Positive">Positive</option>
            </select>
          </div>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Headline finding..."
            className="w-full h-10 px-3.5 text-sm sys-input"
          />
          <textarea
            required
            rows={2}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Supporting evidence and observed participant behavior..."
            className="w-full p-3.5 text-sm sys-input resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs sys-btn-primary cursor-pointer">
              Save Insight
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Findings + Highlight Reel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Verified Findings */}
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
            <div className="p-5 border-b border-[var(--sys-outline-variant)] flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Synthesized Findings
              </h2>
              <div className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-sm)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]">
                {(['All', 'Critical', 'Opportunity', 'Positive'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1 text-xs font-medium rounded-[var(--sys-radius-xs)] transition-colors cursor-pointer ${
                      severityFilter === sev
                        ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] font-semibold shadow-xs'
                        : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[var(--sys-outline-variant)]">
              {studyInsights.map((insight) => (
                <article key={insight.id} className="p-5 md:p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            insight.severity === 'Critical'
                              ? 'var(--sys-danger-fg)'
                              : insight.severity === 'Opportunity'
                              ? 'var(--sys-warning-fg)'
                              : 'var(--sys-success-fg)',
                        }}
                      >
                        {insight.severity}
                      </span>
                      <span aria-hidden="true" className="text-[var(--sys-on-surface-quaternary)]">·</span>
                      <span className="text-[var(--sys-on-surface-tertiary)]">
                        {insight.mentions} mentions
                      </span>
                      <span aria-hidden="true" className="text-[var(--sys-on-surface-quaternary)]">·</span>
                      <span className="font-mono text-[var(--sys-on-surface-tertiary)]">
                        Clip {insight.clipTime}
                      </span>
                    </div>
                    <span className="text-[var(--sys-on-surface-tertiary)]">{insight.timestamp}</span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--sys-on-surface)]">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
                    {insight.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-xs text-[var(--sys-on-surface-tertiary)]">
                      Source: {insight.participantName}
                    </span>

                    <button
                      type="button"
                      disabled={insight.promotedToTask}
                      onClick={() => promoteInsightToTask(insight.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors cursor-pointer disabled:cursor-default ${
                        insight.promotedToTask
                          ? 'bg-[var(--sys-surface-low)] text-[var(--sys-on-surface-tertiary)] border border-[var(--sys-outline-variant)]'
                          : 'sys-btn-secondary'
                      }`}
                    >
                      {insight.promotedToTask ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Tasks</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>Promote to Task</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Interactive Highlight Reel */}
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                  Highlight Reel Synthesis
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
                  Select a timestamped chapter to inspect participant evidence.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sys-btn-primary cursor-pointer whitespace-nowrap"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Reel' : 'Play Clip'}</span>
              </button>
            </div>

            <div className="rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline-variant)] relative aspect-video bg-[var(--sys-surface-low)]">
              <img
                src={ASSETS.heroStudio}
                alt="Synthesized research session highlight"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-5 md:p-6 text-white">
                <p className="text-xs font-mono text-white/80 tabular-nums mb-1.5">
                  {activeChapter.time} · {activeChapter.speaker} · {isPlaying ? 'Playing' : 'Paused'}
                </p>
                <p className="text-sm md:text-base font-medium leading-relaxed max-w-2xl">
                  {activeChapter.quote}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {VIDEO_CHAPTERS.map((chapter) => {
                const active = chapter.id === activeChapter.id;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => {
                      setActiveChapterId(chapter.id);
                      setIsPlaying(true);
                    }}
                    className={`text-left p-3.5 rounded-[var(--sys-radius-sm)] border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--sys-primary-container)] border-[var(--sys-primary)] text-[var(--sys-on-primary-container)]'
                        : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface)] hover:border-[var(--sys-outline)]'
                    }`}
                  >
                    <p className="text-xs font-mono font-semibold tabular-nums">{chapter.time}</p>
                    <p className="text-xs font-semibold mt-1 truncate">{chapter.label}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Column: Thematic Analysis & Click-Density Map */}
        <div className="lg:col-span-4 space-y-6">
          {/* Thematic Analysis */}
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-5">
            <h2 className="text-base font-bold text-[var(--sys-on-surface)]">Thematic Breakdown</h2>
            <div className="space-y-4 tabular-nums">
              {mockThemes.map((theme) => (
                <div key={theme.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--sys-on-surface)]">{theme.name}</span>
                    <span className="font-mono text-[var(--sys-on-surface-tertiary)]">
                      {theme.count} · {theme.sentiment}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--sys-surface-container)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((theme.count / 16) * 100)}%`,
                        backgroundColor:
                          theme.sentiment === 'Positive'
                            ? 'var(--sys-success-fg)'
                            : theme.sentiment === 'Negative'
                            ? 'var(--sys-danger-fg)'
                            : 'var(--sys-primary)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Click Density Layer */}
          <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                First-Click Density
              </h2>
              <button
                type="button"
                onClick={() => setShowHotspots((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sys-primary)] hover:underline cursor-pointer"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{showHotspots ? 'Hide Markers' : 'Show Markers'}</span>
              </button>
            </div>

            <div className="relative rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline-variant)] aspect-[16/10] bg-[var(--sys-surface-low)]">
              <img
                src={ASSETS.checkoutUi}
                alt="Checkout UI click-density map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {showHotspots &&
                CLICK_HOTSPOTS.map((spot) => (
                  <div
                    key={spot.id}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    title={`${spot.label}: ${spot.pct}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-[var(--sys-radius-xs)] bg-[var(--sys-primary)] text-[var(--sys-on-primary)] font-mono text-[11px] font-bold shadow-md tabular-nums"
                  >
                    {spot.pct}
                  </div>
                ))}
            </div>

            <ul className="space-y-2 text-xs tabular-nums">
              {CLICK_HOTSPOTS.map((spot) => (
                <li
                  key={spot.id}
                  className="flex items-center justify-between py-1.5 border-b border-[var(--sys-outline-variant)] last:border-b-0"
                >
                  <span className="text-[var(--sys-on-surface-secondary)]">{spot.label}</span>
                  <span className="font-mono font-semibold text-[var(--sys-on-surface)]">
                    {spot.pct}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectInsights;
