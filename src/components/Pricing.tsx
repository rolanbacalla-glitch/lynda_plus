import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PricingTier {
  id: string;
  name: string;
  audience: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  quotaValue: string;
  quotaUnit: string;
  features: string[];
  featured: boolean;
  cta: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'For PMs & designers auditing scripts for free.',
    monthlyPrice: 0,
    annualPrice: 0,
    quotaValue: 'Unlimited',
    quotaUnit: 'script audits · 2 redacted sessions / mo',
    features: [
      'Unlimited Observer Bias Audits (web & Google Docs)',
      'Client-side Privacy Shield preview on 2 sessions/mo',
      'Five-second & first-click prototype testing',
      '1-click Google Drive brief exports',
      '1 creator seat · BYO participant links',
    ],
    featured: false,
    cta: 'Start Free',
  },
  {
    id: 'team',
    name: 'Team',
    audience: 'For product squads testing live flows weekly.',
    monthlyPrice: 379,
    annualPrice: 299,
    quotaValue: 'Unlimited viewers',
    quotaUnit: '10 creators · 40 hrs synthesis / mo',
    features: [
      'Everything in Starter',
      'Full Client-Side Privacy Shield (face, card & IBAN masking)',
      'Unlimited viewer seats for Legal, PM & Engineering',
      'Google Drive Vault sync + Linear & Jira evidence handoff',
      'BYO Customer Panel CRM + Prolific & Respondent routing',
    ],
    featured: true,
    cta: 'Start 14-Day Team Trial',
  },
  {
    id: 'regulated',
    name: 'Regulated',
    audience: 'For UK/EU fintech, health & enterprise orgs.',
    monthlyPrice: 1850,
    annualPrice: 1490,
    quotaValue: 'Sovereign UK/EU',
    quotaUnit: 'unlimited synthesis · custom SLA',
    features: [
      'Everything in Team',
      'Dedicated London (europe-west2) Firestore & storage isolation',
      'Cryptographic pre-ingestion redaction audit certificates',
      'SAML SSO, SCIM provisioning & custom retention policies',
      'Signed DPA, HIPAA BAA & InfoSec onboarding partner',
    ],
    featured: false,
    cta: 'Book Compliance Demo',
  },
];

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<'annual' | 'monthly'>('annual');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    navigate(currentUser ? '/dashboard' : '/login');
  };

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 bg-[var(--sys-surface-lowest)] border-t border-[var(--sys-outline-variant)]"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Centered Header + Segmented Billing Switch */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[var(--sys-primary)]">
              05. Plans & Pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] tracking-tight">
              Plans & Pricing
            </h2>
          </div>

          <div className="flex flex-col items-center gap-2.5">
            <div
              role="group"
              aria-label="Billing frequency"
              className="inline-flex items-center p-1 rounded-full bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]"
            >
              <button
                type="button"
                onClick={() => setBilling('annual')}
                aria-pressed={billing === 'annual'}
                className={`min-h-[36px] px-5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  billing === 'annual'
                    ? 'bg-[var(--sys-on-surface)] text-[var(--sys-surface-lowest)] shadow-xs'
                    : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                }`}
              >
                Yearly
              </button>
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                aria-pressed={billing === 'monthly'}
                className={`min-h-[36px] px-5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  billing === 'monthly'
                    ? 'bg-[var(--sys-on-surface)] text-[var(--sys-surface-lowest)] shadow-xs'
                    : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                }`}
              >
                Monthly
              </button>
            </div>
            <p className="text-xs text-[var(--sys-on-surface-secondary)]">
              {billing === 'annual'
                ? 'Saving 20% with yearly billing · Zero viewer seat fees'
                : 'Save 20% with yearly billing · Zero viewer seat fees'}
            </p>
          </div>
        </div>

        {/* 3-Column Tier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const activePrice =
              tier.monthlyPrice === null
                ? null
                : billing === 'annual'
                ? tier.annualPrice
                : tier.monthlyPrice;

            const annualSavings =
              tier.monthlyPrice && tier.annualPrice && tier.monthlyPrice > tier.annualPrice
                ? (tier.monthlyPrice - tier.annualPrice) * 12
                : null;

            return (
              <article
                key={tier.id}
                className={`relative rounded-[var(--sys-radius-xl)] p-7 md:p-8 flex flex-col transition-colors ${
                  tier.featured
                    ? 'bg-[var(--sys-surface-lowest)] border-[1.5px] border-[var(--sys-primary)]'
                    : 'bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--sys-primary)] text-[var(--sys-on-primary)] text-[11px] font-semibold tracking-wide whitespace-nowrap">
                    Best Value
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-base font-bold text-[var(--sys-on-surface)]">
                    {tier.name}
                  </h3>
                  <p className="text-xs italic text-[var(--sys-on-surface-secondary)] mt-1">
                    {tier.audience}
                  </p>
                </div>

                <div className="mb-6 tabular-nums">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-[var(--sys-on-surface)]">
                      {activePrice !== null ? `£${activePrice.toLocaleString()}` : 'Custom'}
                    </span>
                    {activePrice !== null && (
                      <span className="text-sm font-medium text-[var(--sys-on-surface-secondary)]">
                        /month
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--sys-on-surface-tertiary)] mt-1.5">
                    {activePrice === 0
                      ? 'Free forever · No credit card required'
                      : billing === 'annual' && annualSavings
                      ? `Billed annually · Save £${annualSavings.toLocaleString()}/yr`
                      : 'Save up to 20% with yearly billing'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSelectPlan}
                  className={`w-full min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer active:scale-[0.985] ${
                    tier.featured
                      ? 'bg-[var(--sys-primary)] text-[var(--sys-on-primary)] hover:opacity-92'
                      : 'bg-[var(--sys-on-surface)] text-[var(--sys-surface-lowest)] hover:opacity-90'
                  }`}
                >
                  {tier.cta}
                </button>

                <div
                  className={`mt-3.5 px-4 py-3 rounded-[var(--sys-radius-md)] text-xs flex items-baseline gap-1.5 tabular-nums ${
                    tier.featured
                      ? 'bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)]'
                      : 'bg-[var(--sys-surface-container)]'
                  }`}
                >
                  <span className="font-bold text-[var(--sys-on-surface)] shrink-0">
                    {tier.quotaValue}
                  </span>
                  <span className="text-[var(--sys-on-surface-secondary)] truncate">
                    {tier.quotaUnit}
                  </span>
                </div>

                <hr className="my-6 border-0 border-t border-[var(--sys-outline-variant)]" />

                <ul className="space-y-3.5 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-[var(--sys-on-surface)] leading-snug"
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          tier.featured
                            ? 'bg-[var(--sys-primary)] text-[var(--sys-on-primary)]'
                            : 'bg-[var(--sys-on-surface)] text-[var(--sys-surface-lowest)]'
                        }`}
                        aria-hidden="true"
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
