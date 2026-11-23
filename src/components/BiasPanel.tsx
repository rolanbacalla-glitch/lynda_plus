import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Wand2 } from 'lucide-react';

interface BiasMetric {
  id: string;
  original: string;
  refined: string;
  status: 'Neutral' | 'Leading' | 'Biased';
}

const INITIAL_METRICS: BiasMetric[] = [
  {
    id: '1',
    original: 'How much do you love this new billing summary?',
    refined: 'What stood out to you when reviewing the billing summary?',
    status: 'Leading',
  },
  {
    id: '2',
    original: 'Describe your frustration with the checkout steps.',
    refined: 'Walk me through each step you took during checkout.',
    status: 'Biased',
  },
  {
    id: '3',
    original: 'Walk me through your thought process when inviting a teammate.',
    refined: 'Walk me through your thought process when inviting a teammate.',
    status: 'Neutral',
  },
];

const BiasPanel: React.FC = () => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleApply = (id: string) => {
    setAppliedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const neutralCount = INITIAL_METRICS.filter(
    (m) => m.status === 'Neutral' || appliedIds.includes(m.id)
  ).length;
  const neutralityPct = Math.round((neutralCount / INITIAL_METRICS.length) * 100);

  return (
    <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-5 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--sys-on-surface)]">Script Bias Audit</h3>
          <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-0.5">
            Live neutrality check for moderator prompts
          </p>
        </div>
        <span className="font-mono text-sm font-bold text-[var(--sys-primary)] tabular-nums">
          {neutralityPct}%
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-[var(--sys-surface-container)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${neutralityPct}%`,
            backgroundColor:
              neutralityPct === 100 ? 'var(--sys-success-fg)' : 'var(--sys-primary)',
          }}
        />
      </div>

      <div className="space-y-3">
        {INITIAL_METRICS.map((metric) => {
          const isNeutral = metric.status === 'Neutral' || appliedIds.includes(metric.id);
          return (
            <div
              key={metric.id}
              className="p-3.5 rounded-[var(--sys-radius-md)] border border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className="inline-flex items-center gap-1.5 font-semibold"
                  style={{
                    color: isNeutral ? 'var(--sys-success-fg)' : 'var(--sys-danger-fg)',
                  }}
                >
                  {isNeutral ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  )}
                  <span>{isNeutral ? 'Neutral' : metric.status}</span>
                </span>

                {!isNeutral && (
                  <button
                    type="button"
                    onClick={() => handleApply(metric.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--sys-primary)] hover:underline cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Neutralise</span>
                  </button>
                )}
              </div>

              <p className="text-xs text-[var(--sys-on-surface)] leading-relaxed">
                {isNeutral ? metric.refined : metric.original}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BiasPanel;
