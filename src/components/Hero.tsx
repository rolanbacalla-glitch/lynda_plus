import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ASSETS } from '../data/mockData';

const PROOF_METRICS = [
  { label: 'Median Synthesis Time', value: '1.8 hrs', detail: 'Down from 3.5 days per study' },
  { label: 'Leading Questions Caught', value: '94%', detail: 'Flagged before participant launch' },
  { label: 'PII Auto-Redaction', value: '100%', detail: 'In-buffer face & document masking' },
  { label: 'Readability Standard', value: 'WCAG AAA', detail: '16.2:1 primary surface contrast' },
];

const Hero: React.FC = () => {
  const { currentUser, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleLaunchWorkspace = async () => {
    if (!currentUser) {
      await loginAsDemo();
    }
    navigate('/dashboard');
  };

  return (
    <section className="pt-14 pb-16 md:pt-20 md:pb-24 border-b border-[var(--sys-outline-variant)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Main Asymmetric 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)] mb-5">
                User Research Workspace · Real-Time Bias Auditing · Automated Synthesis
              </p>

              <h1 className="text-[clamp(2.25rem,4.2vw,3.75rem)] font-bold text-[var(--sys-on-surface)] leading-[1.06] tracking-tight mb-6">
                Research built for{' '}
                <span className="font-serif italic font-normal text-[var(--sys-primary)]">
                  clarity, rigor,
                </span>{' '}
                and speed.
              </h1>

              <p className="text-base md:text-lg text-[var(--sys-on-surface-secondary)] leading-relaxed max-w-xl mb-8">
                Audit interview scripts for observer bias before launch, redact sensitive participant data in real time, and turn recorded sessions into structured product decisions in hours instead of weeks.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleLaunchWorkspace}
                  className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 text-sm sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Launch Interactive Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#bias-audit"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-3 text-sm sys-btn-secondary whitespace-nowrap shrink-0 no-underline"
                >
                  Try Live Bias Audit
                </a>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--sys-outline-variant)] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--sys-on-surface-tertiary)]">
              <span className="inline-flex items-center gap-1.5 text-[var(--sys-on-surface-secondary)] font-medium">
                <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)]" />
                GDPR & HIPAA Privacy Shield
              </span>
              <span aria-hidden="true">·</span>
              <span>EU & UK Data Residency</span>
              <span aria-hidden="true">·</span>
              <span>No Credit Card Required</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] rounded-[var(--sys-radius-lg)] overflow-hidden border border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)] relative">
              {!imgError ? (
                <img
                  src={ASSETS.heroStudio}
                  alt="Product designers and UX researchers reviewing mobile onboarding user flows on a studio display"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-8 text-center bg-[var(--sys-surface-container)]">
                  <ShieldCheck className="w-10 h-10 text-[var(--sys-primary)] mb-3" />
                  <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                    LyndaPlus Collaborative Research Studio
                  </p>
                  <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                    Live script auditing, privacy redaction, and synthesis workspace
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantified Proof Strip Below Hero Split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-10 border-t border-[var(--sys-outline-variant)] tabular-nums">
          {PROOF_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="p-5 rounded-[var(--sys-radius-md)] sys-surface-lowest"
            >
              <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)]">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-[var(--sys-on-surface)] mt-1.5 font-mono">
                {metric.value}
              </p>
              <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
