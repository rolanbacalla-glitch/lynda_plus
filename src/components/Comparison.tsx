import React from 'react';

const COMPETITOR_ROWS = [
  {
    dimension: 'Testing Live Production Flows (Billing, KYC, Clinical)',
    incumbents: 'Prototype tools (Maze, Lyssna) stop at Figma; recording bots expose raw PII to US buckets',
    lynda: 'Client-side Privacy Shield masks faces, cards & IBANs in-browser before bytes leave the device',
  },
  {
    dimension: 'Research Rigour for PMs & Designers',
    incumbents: 'Repositories (Dovetail) synthesise transcripts only after biased questions ruin fieldwork',
    lynda: 'Pre-launch Observer Bias Auditor catches leading, priming & hypothetical prompts upfront',
  },
  {
    dimension: 'Participant Recruiting Economics',
    incumbents: 'Marketplace suites charge 3× panel markups and lock customer records inside closed silos',
    lynda: 'BYO customer panel CRM + zero-markup links to Prolific, Respondent & User Interviews',
  },
  {
    dimension: 'Document & Sprint Handoff',
    incumbents: 'Static slide decks and siloed task lists disconnected from where teams actually work',
    lynda: '1-click Google Drive brief exports, Drive script auditing, and Linear/Jira evidence payloads',
  },
  {
    dimension: 'Stakeholder Seat Pricing',
    incumbents: 'Per-viewer licensing restricts Legal, Engineering, and Leadership from watching clips',
    lynda: 'Unlimited viewer seats included on Team & Regulated plans so evidence actually ships',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Legal blocked every US recording bot from touching our live payout screens. LyndaPlus’s in-buffer Privacy Shield cleared InfoSec review in five days so we finally tested real treasury flows.',
    author: 'Hannah Lindqvist',
    role: 'Staff Product Designer, Finway Payments',
    outcome: '0 PII incidents across 120 live billing sessions',
  },
  {
    quote:
      'Our PMs run weekly discovery without a dedicated UXR on every squad. Auditing Google Docs scripts before launch eliminated leading questions and saved a full sprint of rework.',
    author: 'David Okafor',
    role: 'Head of Research Ops, CareBridge Health',
    outcome: '78% faster synthesis with Drive & Linear handoff',
  },
];

const Comparison: React.FC = () => {
  return (
    <section
      id="compare"
      className="py-16 md:py-24 bg-[var(--sys-surface-low)] border-b border-[var(--sys-outline-variant)]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[var(--sys-primary)] mb-3">
            03. Competitive Positioning
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight mb-4">
            Built for what prototype tools and post-hoc repositories miss.
          </h2>
          <p className="text-base text-[var(--sys-on-surface-secondary)] leading-relaxed">
            Keep your existing recruiting panels and issue trackers. Use LyndaPlus for pre-ingestion privacy, rigorous scripts, and sovereign UK/EU synthesis.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)]">
                  <th className="py-4 px-6 text-xs font-semibold text-[var(--sys-on-surface-secondary)]">
                    Decision Criteria
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-[var(--sys-on-surface-tertiary)]">
                    Incumbent Stack (Maze / Dovetail / UserTesting)
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-[var(--sys-primary)]">
                    LyndaPlus
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sys-outline-variant)] text-sm">
                {COMPETITOR_ROWS.map((row) => (
                  <tr
                    key={row.dimension}
                    className="hover:bg-[var(--sys-surface-low)]/60 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-[var(--sys-on-surface)] align-top">
                      {row.dimension}
                    </td>
                    <td className="py-4 px-6 text-[var(--sys-on-surface-tertiary)] align-top">
                      {row.incumbents}
                    </td>
                    <td className="py-4 px-6 font-medium text-[var(--sys-on-surface)] align-top">
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
