import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type CategoryKey = 'industry' | 'role';

interface SolutionDetail {
  id: string;
  label: string;
  headline: string;
  summary: string;
  workflow: string[];
  metric: string;
}

const SOLUTIONS_DATA: Record<CategoryKey, { title: string; items: SolutionDetail[] }> = {
  industry: {
    title: 'Regulated Industries',
    items: [
      {
        id: 'fintech',
        label: 'Fintech & Payments',
        headline: 'Test live checkout, KYC & treasury screens with zero PII exposure',
        summary:
          'Stop testing stripped-down Figma mocks when real friction lives in production. Privacy Shield masks IBANs, cards, balances, and faces in-browser prior to storage.',
        workflow: [
          'Enforce automated financial DOM & face masking per study',
          'Keep recordings & Firestore indexes inside London (europe-west2)',
          'Export compliance-ready briefs straight to Google Drive for Legal review',
        ],
        metric: 'FCA & GDPR pre-ingestion compliance',
      },
      {
        id: 'healthcare',
        label: 'Digital Health & Clinical',
        headline: 'Protect patient narratives while fixing high-stakes clinician workflows',
        summary:
          'Capture exact UI hesitation across EHR portals and patient onboarding while redacting personal health identifiers before frames leave the browser.',
        workflow: [
          'Apply biometric face blur and patient-ID DOM masking automatically',
          'Route consent-verified BYO patient panels without third-party data brokers',
          'Share clip-backed evidence with unlimited clinician & compliance viewers',
        ],
        metric: 'Built for HIPAA & NHS DSPT workflows',
      },
      {
        id: 'b2b-saas',
        label: 'Enterprise B2B SaaS',
        headline: 'Run rigorous customer discovery on live admin & billing accounts',
        summary:
          'Let PMs and designers interview enterprise customers without leaking tenant data or relying on costly recruiting markups.',
        workflow: [
          'Import discussion guides from Google Drive and audit for leading phrasing',
          'Plug in BYO customers, Prolific, or Respondent via tracked study URLs',
          'Copy verified findings directly into Linear & Jira sprint issues',
        ],
        metric: 'Zero panel markup · Unlimited viewers',
      },
    ],
  },
  role: {
    title: 'By Team Role',
    items: [
      {
        id: 'research-ops',
        label: 'Research Ops & UX Leads',
        headline: 'Set methodological & compliance guardrails across every squad',
        summary:
          'Democratize research safely—every PM script passes neutrality checks and every recording passes Privacy Shield automatically.',
        workflow: [
          'Audit Google Drive scripts in bulk before fieldwork begins',
          'Enforce owner-scoped Firestore governance and role permissions',
          'Maintain a single auditable trail of Drive exports and clips',
        ],
        metric: '100% script neutrality coverage',
      },
      {
        id: 'product-managers',
        label: 'Product Managers',
        headline: 'Run unbiased customer interviews without waiting on dedicated UXR',
        summary:
          'Catch hypothetical intent and confirmation bias as you write questions, then push verified customer clips straight into Linear or Jira.',
        workflow: [
          'Rewrite leading questions into behavioral prompts in one click',
          'Export concise Google Doc synthesis briefs for leadership reviews',
          'Convert high-mention friction into formatted engineering issues',
        ],
        metric: 'Saves 14+ hours per 10-interview sprint',
      },
      {
        id: 'product-designers',
        label: 'Product Designers',
        headline: 'Validate live interactions alongside five-second & first-click checks',
        summary:
          'Combine fast prototype validation with compliant live production walkthroughs in one cohesive workspace.',
        workflow: [
          'Run first-click density and five-second recall tests before handoff',
          'Verify production checkout & onboarding flows with masked real data',
          'Share timestamped evidence clips with zero viewer seat limits',
        ],
        metric: 'Results back in under 2 hours median',
      },
    ],
  },
};

const Solutions: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>('industry');
  const [selectedId, setSelectedId] = useState<string>(SOLUTIONS_DATA.industry.items[0].id);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const currentItems = SOLUTIONS_DATA[category].items;
  const activeSolution = currentItems.find((item) => item.id === selectedId) || currentItems[0];

  const handleCategoryChange = (nextCategory: CategoryKey) => {
    setCategory(nextCategory);
    setSelectedId(SOLUTIONS_DATA[nextCategory].items[0].id);
  };

  const handleTryWorkflow = () => {
    navigate(currentUser ? '/dashboard/create' : '/login');
  };

  return (
    <section id="solutions" className="py-16 md:py-24 border-b border-[var(--sys-outline-variant)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[var(--sys-primary)] mb-3">
              04. Regulated Workflows
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight">
              Purpose-built for UK & EU fintech, health, and enterprise squads.
            </h2>
          </div>

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
