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
  summary: string;
  limits: string[];
  featured: boolean;
  cta: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'For solo researchers & consultants',
    monthlyPrice: 49,
    annualPrice: 39,
    summary: 'Essential script auditing and asynchronous testing for independent practitioners.',
    limits: [
      'Up to 3 active studies simultaneously',
      'Real-time Observer Bias Auditor on all scripts',
      '5 hours / month automated transcript synthesis',
      'Five-second & first-click test templates',
      'Standard CSV & clip exports',
    ],
    featured: false,
    cta: 'Start Free Workspace',
  },
  {
    id: 'team',
    name: 'Team',
    audience: 'For high-velocity product squads',
    monthlyPrice: 199,
    annualPrice: 159,
    summary: 'Complete moderated & unmoderated suite with Privacy Shield and shared synthesis.',
    limits: [
      'Unlimited active studies & 10 editor seats',
      'In-buffer Privacy Shield (face & document masking)',
      '40 hours / month multimodal synthesis & reels',
      'Participant panel CRM & recruitment campaigns',
      'Direct insight-to-task handoff & priority support',
    ],
    featured: true,
    cta: 'Start 14-Day Team Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    audience: 'For regulated & global organizations',
    monthlyPrice: null,
    annualPrice: null,
    summary: 'Sovereign data residency, SSO enforcement, and custom governance controls.',
    limits: [
      'Unlimited seats, workspaces & synthesis hours',
      'EU, UK, or US dedicated data residency',
      'SAML SSO, SCIM provisioning & audit logs',
      'HIPAA BAA & custom retention policies',
      'Dedicated Research Ops onboarding partner',
    ],
    featured: false,
    cta: 'Open Enterprise Demo',
  },
];

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
  const { currentUser, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = async () => {
    if (!currentUser) {
      await loginAsDemo();
    }
    navigate('/dashboard');
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[var(--sys-surface-low)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[var(--sys-primary)] mb-3">
              05. Transparent Plans
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight">
              Predictable pricing with clear study limits.
            </h2>
          </div>

          <div
            role="group"
            aria-label="Billing frequency"
            className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)] self-start md:self-auto"
          >
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors whitespace-nowrap cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                  : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors whitespace-nowrap cursor-pointer ${
                billing === 'annual'
                  ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                  : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const displayPrice =
              tier.monthlyPrice === null
                ? 'Custom'
                : `£${billing === 'annual' ? tier.annualPrice : tier.monthlyPrice}`;

            return (
              <div
                key={tier.id}
                className={`rounded-[var(--sys-radius-lg)] p-6 md:p-8 flex flex-col justify-between bg-[var(--sys-surface-lowest)] border ${
                  tier.featured
                    ? 'border-[var(--sys-primary)] ring-1 ring-[var(--sys-primary)]/20'
                    : 'border-[var(--sys-outline-variant)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[var(--sys-on-surface)]">{tier.name}</h3>
                    {tier.featured && (
                      <span className="text-xs font-semibold text-[var(--sys-primary)]">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--sys-on-surface-tertiary)] mb-6">
                    {tier.audience}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-4 tabular-nums">
                    <span className="text-4xl font-bold font-mono text-[var(--sys-on-surface)]">
                      {displayPrice}
                    </span>
                    {tier.monthlyPrice !== null && (
                      <span className="text-xs text-[var(--sys-on-surface-tertiary)]">
                        / month{billing === 'annual' ? ', billed annually' : ''}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed mb-6 pb-6 border-b border-[var(--sys-outline-variant)]">
                    {tier.summary}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {tier.limits.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[var(--sys-on-surface)]"
                      >
                        <Check className="w-4 h-4 text-[var(--sys-primary)] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleSelectPlan}
                  className={`w-full min-h-[44px] px-5 py-3 text-sm whitespace-nowrap cursor-pointer ${
                    tier.featured ? 'sys-btn-primary' : 'sys-btn-secondary'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
