import React from 'react';

const COMPARISONS = [
  {
    capability: 'Script Quality & Bias Control',
    legacy: 'Manual peer review after fieldwork begins',
    lynda: 'Real-time linguistic audit & 1-click neutral rewrites',
  },
  {
    capability: 'Sensitive PII & Compliance',
    legacy: 'Manual video blurring in post-production',
    lynda: 'In-buffer face, card, and document Privacy Shield',
  },
  {
    capability: 'Live Interview Guidance',
    legacy: 'Static discussion guides in a separate document',
    lynda: 'Contextual follow-up prompts synced to live transcript',
  },
  {
    capability: 'Synthesis Turnaround',
    legacy: '3–5 days of manual tagging & affinity sticky notes',
    lynda: '1.8 hours median turnaround with timestamped clips',
  },
  {
    capability: 'Stakeholder Handoff',
    legacy: 'Static slide decks disconnected from sprint tracking',
    lynda: 'Direct promotion of verified insights into tracked tasks',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'We cut Checkout V2 synthesis from four days to a single afternoon. Catching two leading questions before launch saved us an entire round of rework.',
    author: 'Hannah Lindqvist',
    role: 'Staff Product Designer, Finway Payments',
    outcome: '78% faster synthesis across 120 participants',
  },
  {
    quote:
      'Legal previously blocked live usability recordings on our billing screens. In-buffer Privacy Shield cleared compliance review in one week.',
    author: 'David Okafor',
    role: 'Head of Research Ops, CareBridge Health',
    outcome: 'Zero PII incidents across 340+ sessions',
  },
];

const Comparison: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[var(--sys-surface-low)] border-b border-[var(--sys-outline-variant)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[var(--sys-primary)] mb-3">
            03. Workflow Impact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight mb-4">
            Legacy research tooling vs. an active workspace.
          </h2>
          <p className="text-base text-[var(--sys-on-surface-secondary)] leading-relaxed">
            Replace disconnected survey forms, recording bots, and manual tagging spreadsheets with one coherent system.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)]">
                  <th className="py-4 px-6 text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                    Workflow Stage
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                    Legacy Tools
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-[var(--sys-primary)]">
                    LyndaPlus Workspace
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sys-outline-variant)] text-sm">
                {COMPARISONS.map((row) => (
                  <tr key={row.capability} className="hover:bg-[var(--sys-surface-low)]/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[var(--sys-on-surface)]">
                      {row.capability}
                    </td>
                    <td className="py-4 px-6 text-[var(--sys-on-surface-tertiary)]">
                      {row.legacy}
                    </td>
                    <td className="py-4 px-6 font-medium text-[var(--sys-on-surface)]">
                      {row.lynda}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attributable Testimonials Adjacent to Claims */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.author}
              className="p-6 md:p-8 rounded-[var(--sys-radius-lg)] sys-surface-lowest flex flex-col justify-between gap-6"
            >
              <blockquote className="text-base text-[var(--sys-on-surface)] leading-relaxed">
                “{item.quote}”
              </blockquote>
              <figcaption className="pt-4 border-t border-[var(--sys-outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--sys-on-surface)]">{item.author}</p>
                  <p className="text-xs text-[var(--sys-on-surface-secondary)]">{item.role}</p>
                </div>
                <span className="text-xs font-mono font-medium text-[var(--sys-primary)] tabular-nums">
                  {item.outcome}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Comparison;
