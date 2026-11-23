import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Copy, ExternalLink, Link2 } from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';
import { useAuth } from '../hooks/useAuth';

interface ConnectorCard {
  id: string;
  name: string;
  category: 'Delivery Handoff' | 'External Panel' | 'Document Vault';
  description: string;
  actionLabel: string;
  route?: string;
  connected?: boolean;
}

const IntegrationsHub: React.FC = () => {
  const { projects, insights } = useResearch();
  const { driveAccessToken } = useAuth();

  const [selectedStudyId, setSelectedStudyId] = useState(projects[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [provider, setProvider] = useState<'Prolific' | 'Respondent' | 'User Interviews'>('Prolific');

  const activeStudy = projects.find((p) => p.id === selectedStudyId) || projects[0];
  const studyInsights = insights.filter((i) => i.projectId === activeStudy?.id);
  const effectiveInsights = studyInsights.length > 0 ? studyInsights : insights.slice(0, 3);

  const studyLink = activeStudy
    ? `${window.location.origin}/dashboard/preview?study=${encodeURIComponent(activeStudy.id)}&source=${provider.toLowerCase().replace(/\s+/g, '-')}`
    : '';

  const linearMarkdownPayload = activeStudy
    ? [
        `## Research Evidence: ${activeStudy.name}`,
        `Method: ${activeStudy.method} · Script Neutrality: ${activeStudy.neutralityScore}/100 · Privacy Shield: Enforced`,
        '',
        ...effectiveInsights.map(
          (i) =>
            `- **[${i.severity}] ${i.title}** (${i.mentions} mentions · Clip ${i.clipTime}): ${i.description}`
        ),
      ].join('\n')
    : '';

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Clipboard API restricted
    }
  };

  const connectors: ConnectorCard[] = [
    {
      id: 'google-drive',
      name: 'Google Drive',
      category: 'Document Vault',
      description:
        'Import discussion guides for instant Observer Bias auditing and export compliance briefs as Google Docs.',
      actionLabel: driveAccessToken ? 'Open Drive Vault' : 'Connect Google Drive',
      route: '/dashboard/drive',
      connected: Boolean(driveAccessToken),
    },
    {
      id: 'linear',
      name: 'Linear & Jira Issues',
      category: 'Delivery Handoff',
      description:
        'Push verified, clip-backed findings into your existing sprint backlog instead of managing a siloed task list.',
      actionLabel: 'Copy Issue Payload',
      connected: true,
    },
    {
      id: 'prolific',
      name: 'Prolific / Respondent / User Interviews',
      category: 'External Panel',
      description:
        'Plug your preferred B2B recruiting panel directly into LyndaPlus with tracked completion URLs and BYO-customer CRM.',
      actionLabel: 'Copy Recruitment Link',
      connected: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            Integrations & Handoff
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Connect LyndaPlus to your existing recruiting panels, Google Drive vault, and engineering issue trackers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="handoff-study" className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
            Active Study:
          </label>
          <select
            id="handoff-study"
            value={selectedStudyId}
            onChange={(e) => setSelectedStudyId(e.target.value)}
            className="h-10 px-3 text-xs sys-input max-w-[240px]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Connected Stack Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {connectors.map((c) => (
          <div
            key={c.id}
            className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--sys-on-surface-tertiary)]">{c.category}</span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    color: c.connected ? 'var(--sys-success-fg)' : 'var(--sys-on-surface-tertiary)',
                  }}
                >
                  {c.connected ? 'Ready' : 'Not Connected'}
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">{c.name}</h2>
              <p className="text-xs text-[var(--sys-on-surface-secondary)] leading-relaxed">
                {c.description}
              </p>
            </div>

            {c.route ? (
              <Link
                to={c.route}
                className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-primary no-underline whitespace-nowrap"
              >
                <span>{c.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            ) : c.id === 'linear' ? (
              <button
                type="button"
                onClick={() => void handleCopy('linear', linearMarkdownPayload)}
                className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap cursor-pointer"
              >
                {copiedKey === 'linear' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Issue Markdown</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{c.actionLabel}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleCopy('panel', studyLink)}
                className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap cursor-pointer"
              >
                {copiedKey === 'panel' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Study URL</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{c.actionLabel}</span>
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Two-Column Actionable Generators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Linear / Jira Evidence Handoff Payload */}
        <section className="lg:col-span-7 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Linear / Jira Evidence Brief
              </h2>
              <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                Structured Markdown ready to paste into sprint issues with mention counts and clip timestamps.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCopy('linear-box', linearMarkdownPayload)}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 text-xs sys-btn-secondary cursor-pointer whitespace-nowrap"
            >
              {copiedKey === 'linear-box' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] text-xs font-mono text-[var(--sys-on-surface)] whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {linearMarkdownPayload || 'Create a study to generate an evidence payload.'}
          </pre>
        </section>

        {/* External Panel Handoff Link Builder */}
        <section className="lg:col-span-5 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
              External Panel Link (BYO Recruiting)
            </h2>
            <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5 leading-relaxed">
              Pay zero panel markup—route participants from Prolific, Respondent, or your own customer intercept straight into a Privacy-Shielded session.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Select recruiting provider"
            className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)]"
          >
            {(['Prolific', 'Respondent', 'User Interviews'] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={provider === item}
                onClick={() => setProvider(item)}
                className={`min-h-[34px] px-3 py-1 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors whitespace-nowrap cursor-pointer ${
                  provider === item
                    ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                    : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] font-mono text-xs text-[var(--sys-on-surface)] break-all">
            {studyLink}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => void handleCopy('panel-box', studyLink)}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 text-xs sys-btn-primary cursor-pointer whitespace-nowrap"
            >
              {copiedKey === 'panel-box' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Link</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy {provider} URL</span>
                </>
              )}
            </button>

            <Link
              to="/dashboard/preview"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sys-primary)] hover:underline no-underline"
            >
              <span>Test Participant View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntegrationsHub;
