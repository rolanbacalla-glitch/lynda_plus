import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type CategoryKey = 'role' | 'industry' | 'useCase';

interface SolutionDetail {
  id: string;
  label: string;
  headline: string;
  summary: string;
  workflow: string[];
  metric: string;
}

const SOLUTIONS_DATA: Record<CategoryKey, { title: string; items: SolutionDetail[] }> = {
  role: {
    title: 'By Role',
    items: [
      {
        id: 'ux-researchers',
        label: 'UX Researchers',
        headline: 'Eliminate manual tagging and guard methodology quality',
        summary:
          'Standardize interview guides across squads with automatic bias auditing and instant clip synthesis.',
        workflow: [
          'Audit scripts before launching multi-market recruitment',
          'Capture timestamped transcript moments during live moderation',
          'Export evidence reels directly into team tasks',
        ],
        metric: 'Saves 14+ hours per 10-participant study',
      },
      {
        id: 'product-designers',
        label: 'Product Designers',
        headline: 'Validate prototypes before engineering handoff',
        summary:
          'Run five-second comprehension checks and first-click heatmaps alongside short moderated walkthroughs.',
        workflow: [
          'Drop Figma exports into the Study Composer',
          'Measure first-click accuracy and hesitation timings',
          'Share concise evidence links in design critiques',
        ],
        metric: 'Results back in under 2 hours median',
      },
      {
        id: 'product-managers',
        label: 'Product Managers',
        headline: 'Connect roadmap priorities directly to customer evidence',
        summary:
          'Inspect thematic friction counts and promote verified issues straight into tracked action items.',
        workflow: [
          'Review executive sentiment deltas by release',
          'Watch curated 90-second highlight reels instead of raw calls',
          'Convert high-impact insights into sprint tasks',
        ],
        metric: '3.2x higher stakeholder review rate',
      },
    ],
  },
  industry: {
    title: 'By Industry',
    items: [
      {
        id: 'fintech',
        label: 'Financial Services',
        headline: 'Test live account & billing flows with zero PII leakage',
        summary:
          'In-buffer Privacy Shield redacts account numbers, cards, and personal identifiers before storage.',
        workflow: [
          'Enforce automated screen & face redaction per workspace',
          'Store recordings in EU or UK sovereign regions',
          'Maintain full role-based audit logs',
        ],
        metric: '100% automated PII masking in session',
      },
      {
        id: 'saas',
        label: 'B2B SaaS & DevTools',
        headline: 'Recruit verified technical buyers without panel noise',
        summary:
          'Filter participants by stack, seniority, and past session reliability scores.',
        workflow: [
          'Target verified engineering and product personas',
          'Track invite-to-confirmed funnel velocity',
          'Maintain a curated private panel across releases',
        ],
        metric: '94% average participant show-up reliability',
      },
      {
        id: 'healthcare',
        label: 'Digital Health',
        headline: 'Compliant patient & clinician usability testing',
        summary:
          'Protect sensitive patient narratives while capturing exact interface friction across devices.',
        workflow: [
          'Automatic voice & visual identifier masking',
          'Strict Viewer/Editor/Admin access controls',
          'Clear consent checkpoints built into study preview',
        ],
        metric: 'Built for HIPAA & GDPR research workflows',
      },
    ],
  },
  useCase: {
    title: 'By Use Case',
    items: [
      {
        id: 'usability',
        label: 'Usability Testing',
        headline: 'Pinpoint task drop-offs with click & verbal correlation',
        summary:
          'Pair screen navigation behavior with live transcript sentiment to expose root causes quickly.',
        workflow: [
          'Combine unmoderated click tasks with live follow-ups',
          'Surface friction hotspots by theme frequency',
          'Track neutrality across every moderator prompt',
        ],
        metric: '15% average drop-off recovery post-iteration',
      },
      {
        id: 'concept',
        label: 'Concept & Pricing Testing',
        headline: 'Measure value comprehension in five seconds flat',
        summary:
          'Test positioning, plan hierarchy, and onboarding clarity before writing production code.',
        workflow: [
          'Run timed 5-second visual exposure & open recall',
          'Avoid hypothetical intent bias with automatic audits',
          'Compare variant comprehension side by side',
        ],
        metric: '50-response benchmarks completed same day',
      },
      {
        id: 'discovery',
        label: 'Continuous Discovery',
        headline: 'Keep weekly customer conversations organized and searchable',
        summary:
          'Centralize scheduled interviews, inbox confirmations, and ongoing research tasks in one place.',
        workflow: [
          'Schedule recurring weekly user interviews',
          'Build a compounding repository of verified insights',
          'Track cross-study themes over every quarter',
        ],
        metric: 'Zero lost interview notes across squads',
      },
    ],
  },
};

const Solutions: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>('role');
  const [selectedId, setSelectedId] = useState<string>(SOLUTIONS_DATA.role.items[0].id);
  const { currentUser, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const currentItems = SOLUTIONS_DATA[category].items;
  const activeSolution = currentItems.find((item) => item.id === selectedId) || currentItems[0];

  const handleCategoryChange = (nextCategory: CategoryKey) => {
    setCategory(nextCategory);
    setSelectedId(SOLUTIONS_DATA[nextCategory].items[0].id);
  };

  const handleTryWorkflow = async () => {
    if (!currentUser) {
      await loginAsDemo();
    }
    navigate('/dashboard/create');
  };

  return (
    <section id="solutions" className="py-16 md:py-24 border-b border-[var(--sys-outline-variant)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[var(--sys-primary)] mb-3">
              04. Tailored Workflows
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight">
              Structured for your team’s research cadence.
            </h2>
          </div>

          {/* Interactive Segmented Category Selector */}
          <div
            role="tablist"
            aria-label="Solution categories"
            className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)] self-start md:self-auto"
          >
            {(Object.keys(SOLUTIONS_DATA) as CategoryKey[]).map((key) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleCategoryChange(key)}
                  className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                      : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                  }`}
                >
                  {SOLUTIONS_DATA[key].title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Selection List */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {currentItems.map((item) => {
              const active = item.id === activeSolution.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-5 rounded-[var(--sys-radius-md)] border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--sys-surface-lowest)] border-[var(--sys-primary)] text-[var(--sys-on-surface)]'
                      : 'bg-transparent border-[var(--sys-outline-variant)] text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-low)] hover:text-[var(--sys-on-surface)]'
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-1 line-clamp-2">
                    {item.headline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Active Detail Panel */}
          <div className="lg:col-span-8 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--sys-outline-variant)]">
                <span className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
                  {SOLUTIONS_DATA[category].title} · {activeSolution.label}
                </span>
                <span className="text-xs font-mono font-semibold text-[var(--sys-primary)] tabular-nums">
                  {activeSolution.metric}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[var(--sys-on-surface)]">
                {activeSolution.headline}
              </h3>

              <p className="text-sm md:text-base text-[var(--sys-on-surface-secondary)] leading-relaxed">
                {activeSolution.summary}
              </p>

              <ol className="space-y-3 pt-2">
                {activeSolution.workflow.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-sm text-[var(--sys-on-surface)]"
                  >
                    <span className="font-mono text-xs font-semibold text-[var(--sys-primary)] mt-0.5 tabular-nums">
                      0{index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex justify-end">
              <button
                type="button"
                onClick={handleTryWorkflow}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-sm sys-btn-primary whitespace-nowrap cursor-pointer"
              >
                <span>Build a {activeSolution.label} Study</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
