import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ASSETS } from '../data/mockData';

const PROOF_METRICS = [
  {
    label: 'Pre-Ingestion PII Masking',
    value: 'In-Buffer',
    detail: 'Faces, IBANs & cards blurred before upload',
  },
  {
    label: 'Leading Questions Caught',
    value: 'Before Launch',
    detail: 'Automated bias guardrails for PM & design scripts',
  },
  {
    label: 'Sovereign Cloud Region',
    value: 'europe-west2',
    detail: 'London Firestore isolation + Google Drive Vault',
  },
  {
    label: 'Stakeholder Access',
    value: 'Unlimited',
    detail: 'Zero per-viewer seat tax across product & legal',
  },
];

const Hero: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleLaunchWorkspace = () => {
    navigate(currentUser ? '/dashboard' : '/login');
  };

  return (
    <section className="pt-14 pb-16 md:pt-20 md:pb-24 border-b border-[var(--sys-outline-variant)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Main Asymmetric 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium text-[var(--sys-on-surface-tertiary)] mb-5">
                Compliance-First User Research · Client-Side Privacy Shield · Sovereign UK/EU Sync
              </p>

              <h1 className="text-[clamp(2.25rem,4.1vw,3.65rem)] font-bold text-[var(--sys-on-surface)] leading-[1.06] tracking-tight mb-6">
                Usability research built for{' '}
                <span className="font-serif italic font-normal text-[var(--sys-primary)]">
                  regulated
                </span>{' '}
                product teams.
              </h1>

              <p className="text-base md:text-lg text-[var(--sys-on-surface-secondary)] leading-relaxed max-w-xl mb-8">
                Test live billing, KYC, and clinical flows with real customers without Legal blocking your recordings. LyndaPlus masks PII inside the participant’s browser before upload, enforces unbiased scripts, and syncs directly with Google Drive and Linear.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleLaunchWorkspace}
                  className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 text-sm sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{currentUser ? 'Open Workspace' : 'Start Free Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#privacy-shield"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-3 text-sm sys-btn-secondary whitespace-nowrap shrink-0 no-underline"
                >
                  Test Privacy Shield Live
                </a>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--sys-outline-variant)] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--sys-on-surface-tertiary)]">
              <span className="inline-flex items-center gap-1.5 text-[var(--sys-on-surface-secondary)] font-medium">
                <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)]" />
                FCA, GDPR & HIPAA Ready
              </span>
              <span aria-hidden="true">·</span>
              <span>Google Drive & Linear Native</span>
              <span aria-hidden="true">·</span>
              <span>BYO Panel or Prolific</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] rounded-[var(--sys-radius-lg)] overflow-hidden border border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)] relative">
              {!imgError ? (
                <img
                  src={ASSETS.heroStudio}
                  alt="Product designers and research ops leads reviewing regulated fintech usability flows on a studio display"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-8 text-center bg-[var(--sys-surface-container)]">
                  <ShieldCheck className="w-10 h-10 text-[var(--sys-primary)] mb-3" />
                  <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                    LyndaPlus Regulated Research Workspace
                  </p>
                  <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                    In-buffer PII redaction, script bias auditing, and Google Drive Vault
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
              <p className="text-xl sm:text-2xl font-bold text-[var(--sys-on-surface)] mt-1.5 font-mono">
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
